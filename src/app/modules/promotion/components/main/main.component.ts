import { Component, OnInit, ViewChild } from '@angular/core';
import { Wallet } from '../../../../models/wallet';
import { WalletService } from '../../../../services/wallet.service';
import { AlertService } from '../../../../services/alert.service';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { UtilService } from '../../../../services/util.service';
import { MyCoin } from '../../../../models/mycoin';
import { CoinService } from '../../../../services/coin.service';
import { environment } from '../../../../../environments/environment';
import { TimerService } from '../../../../services/timer.service';
import {StorageService} from '../../../../services/storage.service';
import BigNumber from 'bignumber.js/bignumber';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { CoinOrderService } from 'src/app/services/coinorder.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  wallet: Wallet;
  available: any;
  price: number;
  quantity: number;
  currentCoin: MyCoin;
  gasPrice: number;
  coinName: string;
  gasLimit: number;
  referralCode: string;
  satoshisPerBytes: number;
  faFacebook = faFacebook;
  faTwitter = faTwitter;

  selectedPaymentMethod: string;
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
  paymentmethods: string[] = ['USD', 'USDT', 'FAB', 'BTC', 'ETH'];

  constructor(
    private timerServ: TimerService,
    private storageService: StorageService,
    private walletService: WalletService, 
    private alertServ: AlertService, 
    public utilServ: UtilService,
    private coinorderServ: CoinOrderService,
    private coinService: CoinService
  ) { }

  async ngOnInit() {
    this.wallet = await this.walletService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }  
  }

  bigmul(num1, num2) {
    const x = new BigNumber(num1.toString());
    const result = x.times(num2);
    return result;
  }

  showAvailable(coinName: string) {
    console.log('coinName=', coinName);
    this.coinName = coinName;
    if (coinName === 'USD') {
      this.available = '';
    } else {
      for (let i = 0; i < this.wallet.mycoins.length; i++) {
        console.log('i=', i);
        if (this.wallet.mycoins[i].name === coinName) {
          this.currentCoin = this.wallet.mycoins[i];
          this.available = this.currentCoin.balance;

          const chainName = this.currentCoin.tokenType ? this.currentCoin.tokenType : this.currentCoin.name;
          this.gasPrice = environment.chains[chainName]['gasPrice'];
          this.gasLimit = environment.chains[chainName]['gasLimit'];
          this.satoshisPerBytes = environment.chains[chainName]['satoshisPerBytes'];

          break;
        }
      }
    }

  }

  buyConfirm() {
    if (!this.currentCoin) {
      this.alertServ.openSnackBar('Invalid coin type', 'Ok');
      return;
    }
    this.pinModal.show();
  }

  async onConfirmedPin(pin: string) {
    const pinHash = this.utilServ.SHA256(pin).toString();
    if (pinHash !== this.wallet.pwdHash) {
        this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
        return;
    }

    const currentCoin = this.currentCoin;


    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

    const amount = this.price * this.quantity;
    const doSubmit = true;
    const options = {
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        satoshisPerBytes: this.satoshisPerBytes
    };
    const {txHex, txHash, errMsg} = await this.coinService.sendTransaction(currentCoin, seed, 
        environment.addresses.promotionOfficial[currentCoin.name], amount, options, doSubmit
    );
    console.log('errMsg for sendcoin=', errMsg);
    if (errMsg) {
        this.alertServ.openSnackBar(errMsg, 'Ok');
        return;
    }
    if (txHex && txHash) {
        this.alertServ.openSnackBar('your transaction was submitted successfully.', 'Ok');
        
        const item = {
            walletId: this.wallet.id,
            type: 'Send',
            coin: currentCoin.name,
            tokenType: currentCoin.tokenType,
            amount: amount,
            txid: txHash,
            time: new Date(),
            confirmations: '0',
            blockhash: '', 
            comment: '',
            status: 'pending'
        };
        this.timerServ.transactionStatus.next(item);
        this.timerServ.checkTransactionStatus(item);
        this.storageService.storeToTransactionHistoryList(item);
        this.referralCode = '32RY34';


        this.storageService.getToken().subscribe(
          token => {
            const coinorder = {
              coinName: 'EXG',
              paymentmethod: this.coinName,
              price: this.price,
              quantity: this.quantity,
              txid: txHash,
              token: token
            };        
            this.coinorderServ.addOrder(coinorder).subscribe(
              (res: any) => {
                console.log('res=', res);
              }
            );
          }
        );
    }    
  }
}
