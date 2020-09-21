import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Wallet } from '../../../../models/wallet';
import { WalletService } from '../../../../services/wallet.service';
import { AlertService } from '../../../../services/alert.service';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { UtilService } from '../../../../services/util.service';
import { MyCoin } from '../../../../models/mycoin';
import { CoinService } from '../../../../services/coin.service';
import { environment } from '../../../../../environments/environment';
import { TimerService } from '../../../../services/timer.service';
import { StorageService } from '../../../../services/storage.service';
import BigNumber from 'bignumber.js/bignumber';
import { CampaignOrderService } from '../../../../services/campaignorder.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { UserAuth } from '../../../landing/service/user-auth/user-auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  orders: any;
  wallet: Wallet;
  available: any;
  price: number;
  isodd: boolean;
  showMarkedAsPaidId: string;
  quantity: number;
  comment: string;
  currentCoin: MyCoin;
  gasPrice: number;
  gasLimit: number;
  satoshisPerBytes: number;
  membership: string;
  payableAmount: number;
  coinName: string;
  readyGo: boolean;
  exgAddress: string;
  readyGoReasons: any;
  selectedPaymentCurrency: string;
  loggedIn = false;
  lan = 'en';

  step: number;
  _value: number;
  updated = false;

  get value(): number {
    return this._value;
  }

  set value(val) {
    this.quantity = val / this.price;
    this._value = Number(val);
  }
  referralCode: string;

  token: string;

  selectedPaymentMethod: string;
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
  // currencies: string[] = ['USD', 'RMB', 'DUSD', 'USDT', 'FAB', 'BTC', 'ETH'];
  currencies: string[] = ['USD', 'USDT'];
  methods = {
    'USD': [
      'By Cash App',
      'Wire to eXchangily bank account'
    ],
    'CAD': [
      'E-transfer'
    ],
    'RMB': [
      'Direct transfer'
    ],
    'DUSD': null,
    'USDT': null,
    'FAB': null,
    'BTC': null,
    'ETH': null
  };
  submethods: any;
  prices = {
    'CAD': { 'USD': 0.71 },
    'RMB': { 'USD': 0.14 },
    'EXG': { 'USD': 0.26 },
    'USDT': { 'USD': 1.0 },
    'DUSD': { 'USD': 1.0 },
    'FAB': { 'USD': 0.063272 },
    'BTC': { 'USD': 7250 },
    'ETH': { 'USD': 183.85 }
  };

  constructor(
    private router: Router,
    private timerServ: TimerService,
    private storageService: StorageService,
    private alertServ: AlertService,
    public utilServ: UtilService,
    private apiServ: ApiService,
    private campaignorderServ: CampaignOrderService,
    private coinService: CoinService,
    private tranServ: TranslateService,
    private _userAuth: UserAuth
  ) { }

  getStatusText(status: number) {
    return this.campaignorderServ.getStatusText(status);
  }

  next() {
    if (this.step === 1) {
      this.step = 2;
    } else {
      this.buyConfirm(this._value, this.quantity);
    }
  }

  updateAdd() {
    console.log('this.exgAddress=', this.exgAddress);
    if (!this.exgAddress) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('没有EXG地址', 'Ok');
      } else {
        this.alertServ.openSnackBar('EXG address not found', 'Ok');
      }
      return;
    }
    this.campaignorderServ.importEXGAddress(this.token, this.exgAddress).subscribe(
      (res: any) => {
        console.log('res=', res);
        if (res.ok) {
          this.updated = true;
          this.readyGo = true;
          if (this.lan === 'zh') {
            this.alertServ.openSnackBarSuccess('EXG地址已更新', 'Ok');
          } else {
            this.alertServ.openSnackBarSuccess('EXG address was updated', 'Ok');
          }
        } else {
          this.router.navigate(['/login/signin', { 'retUrl': '/promotion/main' }]);
        }
      }
    );
  }

  markedAsPaid(order) {
    this.showMarkedAsPaidId = order._id;
  }

  confirmMarkedAsPaid(order) {
    const order_id = order._id;
    this.campaignorderServ.confirmMarkedAsPaid(this.token, order_id, this.comment).subscribe(
      (res: any) => {
        console.log('res=', res);
        if (res.ok) {
          this.comment = '';
          this.showMarkedAsPaidId = '';
          for (let i = 0; i < this.orders.length; i++) {
            if (this.orders[i]._id === order_id) {
              this.orders[i].status = '2';
              break;
            }
          }
        }
      }
    );
  }

  async ngOnInit() {
    this.lan = localStorage.getItem('Lan');
    this.apiServ.getUSDValues().subscribe(
      (res: any) => {
        console.log('res for getUSDValues=', res);
        if (res.success) {
          const data = res.data;
          this.price = data.USD;
          if(this.price < 0.25) {
            this.price = 0.25;
          }
        }
      }
    );

    this._userAuth.isLoggedIn$
      .subscribe((value: string) => {
        console.log('value: ' + value);
        this.loggedIn = value ? true : false;
        // alert(this.loggedIn);
      });

    this.readyGo = true;
    this.step = 1;
    this.wallet = await this.storageService.getCurrentWallet();
    // this.price = this.prices.EXG.USD;
    this.storageService.getToken().subscribe(
      (token: string) => {
        if (!token) {
          this.readyGo = false;
          if (!this.readyGoReasons) {
            this.readyGoReasons = [];
          }
          this.readyGoReasons.push('NotLogin');
          // this.router.navigate(['/login/signin', { 'retUrl': '/promotion/main' }]);
        } else {

          let exgAddress = '';
          if (this.wallet && this.wallet.mycoins) {
            for (let i = 0; i < this.wallet.mycoins.length; i++) {
              const coin = this.wallet.mycoins[i];
              if (coin.name === 'FAB') {
                exgAddress = coin.receiveAdds[0].address;
              }
            }
          }

          this.exgAddress = exgAddress;

          this.readyGo = true;
          this.token = token;
          this.campaignorderServ.getOrders(token).subscribe(
            (res: any) => {
              console.log('res for getOrders=', res);
              if (res && res.ok) {
                this.orders = res._body;
              }
            }
          );

          this.campaignorderServ.getProfile(token).subscribe(
            (res: any) => {
              if (res && res.ok) {
                const body = res._body;
                let kyc = body.kyc;
                this.membership = body.membership;
                const walletExgAddress = body.walletExgAddress;

                if (!walletExgAddress) {
                  this.readyGo = false;
                } else {
                  if (this.exgAddress !== walletExgAddress) {
                    this.readyGo = false;
                  }
                }
                if (!this.readyGo) {
                  if (!this.readyGoReasons) {
                    this.readyGoReasons = [];
                  }
                  this.readyGoReasons.push('exgAddressNotMatch');
                }
                kyc = 100;
                if (kyc === 100) {
                  this.readyGo = true;
                } else {
                  this.readyGo = false;
                  if (!this.readyGoReasons) {
                    this.readyGoReasons = [];
                  }
                  if (kyc === -1) {
                    this.readyGoReasons.push('KycDenied');
                  } else if (kyc === 0) {
                    this.readyGoReasons.push('NoKyc');
                  } else if (kyc === 1) {
                    this.readyGoReasons.push('SubmitKyc');
                  } else if (kyc === 2) {
                    this.readyGoReasons.push('KycInProcess');
                  } else if (kyc === 3) {
                    this.readyGoReasons.push('KycHasProblem');
                  }
                  // -1-denied, 0-no, 1-submit; 2-in porcess, 3-has problem,
                }
              } else {
                this.readyGo = false;
                if (!this.readyGoReasons) {
                  this.readyGoReasons = [];
                }
                this.readyGoReasons.push('TokenExpired');
              }
            }
          );
        }
      }
    );

    if (!this.wallet) {
      // this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      if (!this.readyGoReasons) {
        this.readyGoReasons = [];
      }
      this.readyGoReasons.push('NoWallet');
      return;
    }
  }

  createWallet() {
  }

  getSubtotal() {
    const x = new BigNumber(this.price.toString());
    const result = x.times(this.quantity);

    let coinPrice = 1;
    if (this.selectedPaymentCurrency !== 'USD') {
      coinPrice = this.prices[this.selectedPaymentCurrency]['USD'];
    }
    this.value = result.times(coinPrice).toNumber();

    return result;
  }

  async selectCurrency(coinName: string)  {
    console.log('methods=', this.methods);
    this.submethods = this.methods[coinName];
    if (this.submethods && this.submethods.length) {
      this.selectedPaymentMethod = this.submethods[0];
    } else {
      this.selectedPaymentMethod = null;
    }

    let coinPrice = 1;
    if (coinName !== 'USD') {
      coinPrice = this.prices[coinName]['USD'];
    }

    // this.price = this.prices['EXG']['USD'] / coinPrice;

    this.payableAmount = this.price * this.quantity / coinPrice;
    if (coinName === 'BTC') {
      this.payableAmount = Number(this.payableAmount.toFixed(5));
    } else {
      this.payableAmount = Number(this.payableAmount.toFixed(2));
    }

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
          if(coinName == 'USDT' || coinName == 'ETH') {
            const gasPrice = await this.coinService.getEthGasprice();
            if(gasPrice > this.gasPrice) {
              this.gasPrice = gasPrice
            }
          }
          this.gasLimit = environment.chains[chainName]['gasLimitToken'];
          this.satoshisPerBytes = environment.chains[chainName]['satoshisPerBytes'];

          break;
        }
      }
    }
  }

  /*
      campaignId: ObjectId,
      memberId: ObjectId,
      walletAdd: String,
      amount: Number,
      txId: String, // USDT txid
      payMethod: String,
      payCurrency: String,
      price: Number,
      value: Number,
      paymentDesc: String,
  */

  addOrder(txid: string, amount: number, qty: number) {
    const coinorder = {
      campaignId: 1,
      payCurrency: this.selectedPaymentCurrency,
      payMethod: this.selectedPaymentMethod,
      price: this.price,
      payableValue: this.payableAmount,
      quantity: qty,
      amount: amount,
      txId: txid,
      token: this.token
    };
    console.log('coinorder===', coinorder);
    this.campaignorderServ.addOrder(coinorder).subscribe(
      (res: any) => {
        if (res.ok) {
          const body = res._body;
          if (!this.orders) {
            this.orders = [];
          }
          this.orders.unshift(body);
          this.campaignorderServ.getProfile(this.token).subscribe(
            (res2: any) => {
              if (res2 && res2.ok) {
                console.log('res2=', res2);
                // this.referralCode = res2._body.referralCode;
                // this.membership = res2._body.membership;
                this.quantity = 0;
                this.step = 1;
                this.value = 0;
              }
            }
          );
        }
      }
    );
  }

  buyConfirm(amt: number, qty: number) {
    /*
    if (!this.currentCoin) {
      this.alertServ.openSnackBar('Invalid coin type', 'Ok');
      return;
    }
    */
    if (
      (this.selectedPaymentCurrency === 'USDT') ||
      (this.selectedPaymentCurrency === 'DUSD') ||
      (this.selectedPaymentCurrency === 'FAB') ||
      (this.selectedPaymentCurrency === 'BTC') ||
      (this.selectedPaymentCurrency === 'ETH')
      // ('USDT,DUSD'.indexOf(this.selectedPaymentCurrency) >= 0)
    ) {
      if (this.payableAmount >= this.available) {
        this.tranServ.get('Not enough fund').subscribe(
          (notEnoughFund: string) => {
            this.tranServ.get('Ok').subscribe(
              (ok: string) => {
                this.alertServ.openSnackBar(notEnoughFund, ok);
              }
            );
          }
        );

        return;
      } else {
        let eth = 0;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
          if (this.wallet.mycoins[i].name == 'ETH') {
            eth = this.wallet.mycoins[i].balance;
          }
        }

        const transFeeDouble = new BigNumber(this.gasPrice).multipliedBy(new BigNumber(this.gasLimit)).dividedBy(new BigNumber(1e9)).toNumber();
        if(eth < transFeeDouble) {
          this.tranServ.get('Not enough transaction fee').subscribe(
            (notEngoutTransactioFee: string) => {
              this.tranServ.get('Ok').subscribe(
                (ok: string) => {
                  this.alertServ.openSnackBar(notEngoutTransactioFee, ok);
                }
              );
            }
          );
          return;
        } else {
          this.pinModal.show();
        }

        return;
      }

    } else {
      this.value = 0;
      this.step = 1;
      this.addOrder('', amt, qty);
    }

  }

  async onConfirmedPin(pin: string) {
    const pinHash = this.utilServ.SHA256(pin).toString();
    if (pinHash !== this.wallet.pwdHash) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('密码错误', 'Ok');
      } else {
        this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
      }
      return;
    }

    const currentCoin = this.currentCoin;

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

    const amount = this.price * this.quantity;
    console.log('amount0===', amount);
    console.log('this.quantity0===', this.quantity);
    const doSubmit = true;
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      satoshisPerBytes: this.satoshisPerBytes
    };
    console.log('options theee=', options);
    console.log('amount000===', amount);
    console.log('this.quantity000===', this.quantity);
    const { txHex, txHash, errMsg } = await this.coinService.sendTransaction(currentCoin, seed,
      environment.addresses.promotionOfficial[currentCoin.name], amount, options, doSubmit
    );
    console.log('amount001===', amount);
    console.log('this.quantity001===', this.quantity);
    console.log('errMsg for sendcoin=', errMsg);
    if (errMsg) {
      this.alertServ.openSnackBar(errMsg, 'Ok');
      return;
    }
    if (txHex && txHash) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBarSuccess('交易提交成功。', 'Ok');
      } else {
        this.alertServ.openSnackBarSuccess('your transaction was submitted successfully.', 'Ok');
      }

      console.log('amount1===', amount);
      console.log('this.quantity1===', this.quantity);
      const item = {
        walletId: this.wallet.id,
        type: 'Send',
        coin: currentCoin.name,
        tokenType: currentCoin.tokenType,
        amount: amount,
        txid: txHash,
        to: environment.addresses.promotionOfficial[currentCoin.name],
        time: new Date(),
        confirmations: '0',
        blockhash: '',
        comment: '',
        status: 'pending'
      };
      this.timerServ.transactionStatus.next(item);
      this.timerServ.checkTransactionStatus(item);
      this.storageService.storeToTransactionHistoryList(item);
      console.log('amount2===', amount);
      console.log('this.quantity2===', this.quantity);
      this.addOrder(txHash, amount, this.quantity);

    }
  }

  logout() {
    console.log("Going to logout");
    console.log("token: " + this.storageService.getToken());


    this._userAuth.id = '';
    this._userAuth.email = '';
    this._userAuth.token = '';
    this._userAuth.logout();
    this.storageService.removeToken();

    console.log("token: " + this.storageService.getToken());
    this.router.navigate(['/']);
  }

}

