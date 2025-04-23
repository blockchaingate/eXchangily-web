import { Component, OnInit, ViewChild } from '@angular/core';
import { OtcPlaceOrderModal } from '../../modals/otc-place-order/otc-place-order';
import { OtcPlaceOrderErrorModal } from '../../modals/otc-place-order-error/otc-place-order-error.component';
import { ApplyForMerchantModal } from '../../modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from '../../modals/confirm-payment/confirm-payment';
import { OtcCoinAddressModal } from '../../modals/otc-coin-address/otc-coin-address.component';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
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
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
  balance: number;
  order: any;
  bidOrAsk: boolean;
  coinName: string;
  currency: string;
  token: string;
  element: any;
  orderId: string;
  txid: string;
  quantity: number;
  currentCoin: MyCoin;
  wallet: any;
  gasPrice: number;
  gasLimit: number;
  satoshisPerBytes: number;
  addressIncorrect: boolean;

  commissionRate = environment.OTC_COMMISSION_RATE;
  currencies: string[] = ['USD', 'CAD', 'CNY', 'EURO'];

  dataSource: any;
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
  @ViewChild('otcPlaceOrderModal', { static: true }) otcPlaceOrderModal: OtcPlaceOrderModal;
  @ViewChild('otcCoinAddressModal', { static: true }) otcCoinAddressModal: OtcCoinAddressModal;
  @ViewChild('otcPlaceOrderErrorModal', { static: true }) otcPlaceOrderErrorModal: OtcPlaceOrderErrorModal;
  @ViewChild('applyForMerchantModal', { static: true }) applyForMerchantModal: ApplyForMerchantModal;
  @ViewChild('confirmPaymentModal', { static: true }) confirmPaymentModal: ConfirmPaymentModal;

  constructor(
    private userServ: UserService,
    private timerServ: TimerService,
    private coinService: CoinService,
    private alertServ: AlertService,
    private translateServ: TranslateService,
    public utilServ: UtilService,
    private _router: Router,
    private storageService: StorageService,
    private _otcServ: OtcService) { }

  async ngOnInit() {
    this.addressIncorrect = false;
    this.bidOrAsk = true;
    this.coinName = 'USDT';
    this.currency = 'USD';
    this.wallet = await this.storageService.getCurrentWallet();
    // this.dataSource = ELEMENT_DATA;
    this.dataSource = [];
    this._otcServ.getPublicListings().toPromise().then(
      (res: any) => {
        console.log('res from addListing=', res);
        if (res && res.ok) {
          this.dataSource = res._body;
          if(this.dataSource && (this.dataSource.length > 0)) {
            this.dataSource = this.dataSource.filter(item => item.qtyAvilable > 0);
          }
          console.log('this.dataSource===', this.dataSource);
        }
      }
    );

    this.storageService.getToken().subscribe(
      (token: any) => {
        this.token = token;
        if (!this.token) {
          this._router.navigate(['/login/signin', { 'retUrl': '/otc/trade' }]);
        }
      });
  }

  changeCoinName(bOrA: boolean, coin: string) {
    this.bidOrAsk = bOrA;
    this.coinName = coin;
    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const mycoin = this.wallet.mycoins[i];
      if (mycoin.name === coin) {
        this.balance = mycoin.balance;

        this.currentCoin = mycoin;

        const chainName = this.currentCoin.tokenType ? this.currentCoin.tokenType : this.currentCoin.name;
        this.gasPrice = environment.chains[chainName]['gasPrice'];
        this.gasLimit = environment.chains[chainName]['gasLimit'];
        if (this.currentCoin.tokenType) {
          this.gasLimit = environment.chains[chainName]['gasLimitToken'];
        }
        this.satoshisPerBytes = environment.chains[chainName]['satoshisPerBytes'];
      }
    }
  }

  placeOrder(element) {
    this.userServ.getMe(this.token).subscribe(
      (res: any) => {
        console.log('res===', res);
        if (res && res.ok) {
          const data = res._body;
          /*
          const walletExgAddress = data.walletExgAddress;
          const walletBtcAddress = data.walletBtcAddress;
          const walletEthAddress = data.walletEthAddress;
          let walletExg = '';
          let walletBtc = '';
          let walletEth = '';

          
          if (!this.wallet) {
            console.log('wallet not Existed');
            this.otcPlaceOrderErrorModal.show('WalletNotExisted');
            return;
          }
          for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const mycoin = this.wallet.mycoins[i];
            if (mycoin.name == 'FAB') {
              walletExg = mycoin.receiveAdds[0].address;
            }
            if (mycoin.name == 'BTC') {
              walletBtc = mycoin.receiveAdds[0].address;
            }
            if (mycoin.name == 'ETH') {
              walletEth = mycoin.receiveAdds[0].address;
            }
          }

          if ((walletExgAddress != walletExg) || (walletBtcAddress != walletBtc) || (walletEthAddress != walletEth)) {
            this.addressIncorrect = true;
            console.log('addressIncorrect');
            this.otcPlaceOrderErrorModal.showEx('AddressesNotMatch', this.token, walletExg, walletBtc, walletEth);
            return;
          }
          */
          this.element = element;
          this.otcPlaceOrderModal.show(data, element);
        } else {
          this._router.navigate(['/login/signin', { 'retUrl': '/otc/trade' }]);
        }
      });

  }

  onConfirmedCoinAddress(event) {
    console.log('onConfirmedCoinAddress start');
    const address = event.address;
    this._otcServ.updateOrderAddress(this.token, this.orderId, address).toPromise().then(
      (res: any) => {
        if(res && res.ok) {
          this._router.navigate(['/otc/order-detail/' + this.orderId]);
        }
      }
    );
  }

  onConfirmedPlaceOrder(event) {

    /*
    console.log('event=', event);
    
    if (this.bidOrAsk) {
      
    } else {
      console.log('haha');
      this.quantity = this.order.quantity;
      this.pinModal.show();
    }
    */
   this.order = event;
   this.addOrderDo();
  }

  addOrderDo() {
    console.log('addOrderDo start');
    this._otcServ.addOrder(this.token, this.element._id, this.order).toPromise().then(
      (res: any) => {
        console.log('res for addOrder=', res);
        if (res.ok) {
          const orderId = res._body;
          this.orderId = orderId;
          // this.element = data;
          this.otcCoinAddressModal.show(this.element.coin, this.wallet);
          // this._router.navigate(['/otc/order-detail/' + data]);
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

    console.log('amount=', amount);
    const doSubmit = true;
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      satoshisPerBytes: this.satoshisPerBytes
    };

    console.log('currentCoin==', currentCoin);
    if(!seed) {
      return;
    }
    const { txHex, txHash, errMsg } = await this.coinService.sendTransaction(currentCoin, seed,
      environment.addresses.otcOfficial[currentCoin.name], amount, options, doSubmit
    );

    if (errMsg) {
      this.alertServ.openSnackBar(errMsg, 'Ok');
      return;
    }
    if (txHex && txHash) {
      this.alertServ.openSnackBarSuccess(this.translateServ.instant('your transaction was submitted successfully.'), 'Ok');
      /*
        if (this.lan === 'zh') {
            this.alertServ.openSnackBar('交易成功提交', 'Ok');
        } else {
            this.alertServ.openSnackBar('your transaction was submitted successfully.', 'Ok');
        }
      */
      const item: any = {
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

  placeAdv() {
  }

  onBecomeMerchant(event) {
  }

  onConfirmPayment(event) {

  }
}
