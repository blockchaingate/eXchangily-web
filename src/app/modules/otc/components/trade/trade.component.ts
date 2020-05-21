import { Component, OnInit, ViewChild } from '@angular/core';
import { OtcPlaceOrderModal } from '../../modals/otc-place-order/otc-place-order';
import { ApplyForMerchantModal } from '../../modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from '../../modals/confirm-payment/confirm-payment';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
import { WalletService } from '../../../../services/wallet.service';
import { Wallet } from '../../../../models/wallet';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { UtilService } from '../../../../services/util.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../../services/alert.service';
import { MyCoin } from '../../../../models/mycoin';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import { TimerService } from '../../../../services/timer.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  balance: number;
  order: any;
  bidOrAsk: boolean;
  coinName: string;
  currency: string;
  token: string;
  element: any;
  txid: string;
  quantity: number;
  currentCoin: MyCoin;
  wallet: Wallet;
  gasPrice: number;
  gasLimit: number;
  satoshisPerBytes: number;

  commissionRate = environment.OTC_COMMISSION_RATE;
  currencies: string[] = [
    'USD',
    'CAD',
    'CNY'
  ];

  dataSource: any;
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
  @ViewChild('otcPlaceOrderModal', { static: true }) otcPlaceOrderModal: OtcPlaceOrderModal;
  @ViewChild('applyForMerchantModal', { static: true }) applyForMerchantModal: ApplyForMerchantModal;
  @ViewChild('confirmPaymentModal', { static: true }) confirmPaymentModal: ConfirmPaymentModal;

  constructor(
    private userServ: UserService,
    private timerServ: TimerService,
    private coinService: CoinService,
    private alertServ: AlertService,
    private translateServ: TranslateService,
    public utilServ: UtilService,
    private walletService: WalletService,
    private _router: Router, 
    private storageService: StorageService, 
    private _otcServ: OtcService) { }

  async ngOnInit() {
    this.bidOrAsk = true;
    this.coinName = 'USDT';
    this.currency = 'USD';
    this.wallet = await this.walletService.getCurrentWallet();
    // this.dataSource = ELEMENT_DATA;
    this.dataSource = [];
    this._otcServ.getPublicListings().subscribe(
      (res: any) => {
        console.log('res from addListing=', res);
        if (res && res.ok) {
          this.dataSource = res._body;
          console.log('this.dataSource===', this.dataSource);
        }
      }
    );

    this.storageService.getToken().subscribe(
      (token: string) => {
        this.token = token;
        if (!this.token) {
          this._router.navigate(['/login/signin', { 'retUrl': '/otc/trade' }]);
        }
      });
  }

  changeCoinName(bOrA: boolean, coin: string) {
    this.bidOrAsk = bOrA;
    this.coinName = coin;
    for(let i=0;i<this.wallet.mycoins.length;i++) {
      const mycoin = this.wallet.mycoins[i];
      if(mycoin.name == coin) {
        this.balance = mycoin.balance;
        console.log('this.balance=', this.balance);

        this.currentCoin = mycoin;

        const chainName = this.currentCoin.tokenType ? this.currentCoin.tokenType : this.currentCoin.name;
        this.gasPrice = environment.chains[chainName]['gasPrice'];
        this.gasLimit = environment.chains[chainName]['gasLimit'];
        this.satoshisPerBytes = environment.chains[chainName]['satoshisPerBytes'];        
      }
    }
  }

  placeOrder(element) {

    this.userServ.getMe(this.token).subscribe(
      (res: any) => {
        console.log('res===', res);
        if (res && res.ok) {
          this.element = element;
          this.otcPlaceOrderModal.show(element);          
        } else {
          this._router.navigate(['/login/signin', { 'retUrl': '/otc/trade' }]);
        }
      });    

  }

  onConfirmedPlaceOrder(event) {

    console.log('event=', event);
    this.order = event;
    if(this.bidOrAsk) {
      this.addOrderDo();
    } else {
      console.log('haha');
      this.quantity = this.order.quantity;
      this.pinModal.show();
    }

  }

  addOrderDo() {
    //txid;
    this._otcServ.addOrder(this.token, this.element._id, this.order).subscribe(
      (res: any) => {
        console.log('res for addOrder=', res);
        if (res.ok) {
          const data = res._body;
          this.element = data;
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i]._id == this.element._id) {
              this.dataSource[i].qtyAvilable = this.element.qtyAvilable;
            }
          }
        }
      }
    );
  }


  async onConfirmedPin(pin: string) {
    const pinHash = this.utilServ.SHA256(pin).toString();
    if (pinHash !== this.wallet.pwdHash) {
      /*
        if (this.lan === 'zh') {
            this.alertServ.openSnackBar('密码错误', 'Ok');
        } else {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
        }
        */
       this.alertServ.openSnackBar(this.translateServ.instant('Your password is invalid.'), 'Ok');
        return;
    }

    const currentCoin = this.currentCoin;

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

    const amount = this.quantity * (1 + this.commissionRate);

    const doSubmit = true;
    const options = {
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        satoshisPerBytes: this.satoshisPerBytes
    };

    const { txHex, txHash, errMsg } = await this.coinService.sendTransaction(currentCoin, seed,
        environment.addresses.otcOfficial[currentCoin.name], amount, options, doSubmit
    );

    if (errMsg) {
        this.alertServ.openSnackBar(errMsg, 'Ok');
        return;
    }
    if (txHex && txHash) {
      this.alertServ.openSnackBar(this.translateServ.instant('your transaction was submitted successfully.'), 'Ok');
      /*
        if (this.lan === 'zh') {
            this.alertServ.openSnackBar('交易成功提交', 'Ok');
        } else {
            this.alertServ.openSnackBar('your transaction was submitted successfully.', 'Ok');
        }
      */
        const item = {
            walletId: this.wallet.id,
            type: 'Send',
            coin: currentCoin.name,
            tokenType: currentCoin.tokenType,
            amount: amount,
            txid: txHash,
            to: environment.addresses.otcOfficial[currentCoin.name],
            time: new Date(),
            confirmations: '0',
            blockhash: '',
            comment: '',
            status: 'pending'
        };
        this.timerServ.transactionStatus.next(item);
        this.timerServ.checkTransactionStatus(item);
        this.storageService.storeToTransactionHistoryList(item);

        this.txid = txHash.trim();
        this.order.txid = txHash.trim();
        this.addOrderDo();
        // this.addOrder(txHash, amount, this.quantity);
    }
}




  becomeMerchant() {
    this._router.navigate(['/otc/otc-merchant/merchant-application']);
    // this.applyForMerchantModal.show();
  }

  placeAdv() {

  }

  onBecomeMerchant(event) {
  }

  onConfirmPayment(event) {

  }
}
