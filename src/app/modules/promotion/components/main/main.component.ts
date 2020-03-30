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
  orders: any;
  wallet: Wallet;
  available: any;
  price: number;
  quantity: number;
  currentCoin: MyCoin;
  gasPrice: number;
  membership: string;
  coinName: string;
  selectedPaymentCurrency: string;
  gasLimit: number;
  value: number;
  referralCode: string;
  satoshisPerBytes: number;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  token: string;

  selectedPaymentMethod: string;
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
  currencies: string[] = ['USD', 'CAD', 'RMB', 'USDT', 'FAB', 'BTC', 'ETH'];
  methods = {
    'USD': [
      'E-transfer', 'Direct transfer'
    ],
    'CAD': [
      'E-transfer', 'Direct transfer'
    ],
    'RMB': [
      'Wechat', 'Alipay', 'Direct transfer'
    ],
    'USDT': [
      'from eXchangily wallet', 'from other wallets'
    ],
    'FAB': [
      'from eXchangily wallet', 'from other wallets'
    ],
    'BTC': [
      'from eXchangily wallet', 'from other wallets'
    ],
    'ETH': [
      'from eXchangily wallet', 'from other wallets'
    ]                
  };
  submethods: any;
  prices = {
    "CAD":{"USD":0.71},
    "RMB":{"USD":0.14},
    "BTC":{"USD":6620.53},
    "ETH":{"USD":134.86},
    "FAB":{"USD":0.069248},
    "USDT":{"USD":1.0},
    "EXG": {"USD": 0.23}
  };

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

    this.storageService.getToken().subscribe(
      (token:string) => {  
        this.token = token;     
        this.coinorderServ.getOrders(token).subscribe(
          (res: any) => {
            console.log('res for getOrders=', res);
            if(res && res.ok) {
              this.orders = res._body;

            }
          }
        );
      }
    );

    if (!this.wallet) {
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }  
  }


  getSubtotal() {
    
    const x = new BigNumber(this.price.toString());
    const result = x.times(this.quantity);

    let coinPrice = 1;
    if(this.selectedPaymentCurrency != 'USD') {
      coinPrice = this.prices[this.selectedPaymentCurrency]['USD'];
    }  
    this.value  = result.times(coinPrice).toNumber();
      
    return result;
  }

  selectCurrency(coinName: string) {
    console.log('methods=', this.methods);
    this.submethods = this.methods[coinName];
    let coinPrice = 1;
    if(coinName != 'USD') {
      coinPrice = this.prices[coinName]['USD'];
    }
    this.price = this.prices['EXG']['USD'] / coinPrice;
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

  addOrder(txid:string) {
    const coinorder = {
      coinName: 'EXG',
      paymentcurrency: this.selectedPaymentCurrency,
      paymentmethod: this.selectedPaymentMethod,
      price: this.price,
      quantity: this.quantity,
      value: this.value,
      txid: txid,
      token: this.token
    };        
    this.coinorderServ.addOrder(coinorder).subscribe(
      (res: any) => {
        console.log('res=', res);
        if(res.ok) {
          this.coinorderServ.getProfile(this.token).subscribe(
            (res2:any) => {
              if(res2 && res2.ok) {
                console.log('res2=', res2);
                //this.referralCode = res2._body.referralCode;
                //this.membership = res2._body.membership;
              }
            }
          );
        }
      }
    );;   
  }
  buyConfirm() {
    /*
    if (!this.currentCoin) {
      this.alertServ.openSnackBar('Invalid coin type', 'Ok');
      return;
    }
    */
    if(('USDT,FAB,BTC,ETH'.indexOf(this.selectedPaymentCurrency) >= 0) && this.selectedPaymentMethod === 'from eXchangily wallet') {
      this.pinModal.show();
    } else {
      this.addOrder('');
    }
    
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

     
        this.addOrder(txHash);
    }    
  }
}
