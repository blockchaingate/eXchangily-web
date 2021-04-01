import { Component, OnInit } from '@angular/core';
import { OtcService } from '../../../../services/otc.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment';
import { UserService } from '../../../../services/user.service';
import { StorageService } from '../../../../services/storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentMethodService } from '../../../../services/paymentmethod.service';
import { AlertService } from '../../../../services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../services/util.service';

@Component({
  selector: 'app-otc-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  id: string;
  order: any;
  user: any;
  achChecked: boolean;
  accountName: string;
  memberAccountName: string;
  receivingAddress: string;
  token: string;
  achAccountBundle: any;
  achAccount2: any;
  privateKey: string;
  achAccount: string;
  userpaymentmethodCashApp: any;
  userpaymentmethodACH: any;
  userpaymentmethodACH2: any;
  userpaymentmethods: any;
  goPayStep: number;
  modalRef: BsModalRef;

  routingNumber: string;
  accountNumber: string;

  customerName: string;
  companyName: string;
  billingAddress: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  email: string;
  phone: string;

  constructor(
    private modalService: BsModalService,
    private storageService: StorageService,
    private userServ: UserService,
    private alertServ: AlertService,
    private translateServ: TranslateService,
    private apiServ: ApiService,
    private utilServ: UtilService,
    private paymentmethodServ: PaymentMethodService,
    private route: ActivatedRoute,
    private _otcServ: OtcService) {

  }
  ngOnInit() {
    this.achChecked = true;
    this.goPayStep = 1;
    this.id = this.route.snapshot.paramMap.get('id');
    this.storageService.getToken().subscribe(
      (token: string) => {
        this.token = token;

        this.paymentmethodServ.getUserPaymentMethods(this.token).subscribe(
          (res: any) => {
            console.log('res for getUserPaymentMethods', res);

            if (res && res.ok) {
              this.userpaymentmethods = res._body;
              for(let i = 0; i < this.userpaymentmethods.length;i++) {
                const userpaymentmethod = this.userpaymentmethods[i];
                if(userpaymentmethod.method == 'CashApp') {
                  this.userpaymentmethodCashApp = userpaymentmethod;
                  this.accountName = userpaymentmethod.details;
                } else 
                if(userpaymentmethod.method == 'ACH') {
                  this.userpaymentmethodACH = userpaymentmethod;
                } else
                if(userpaymentmethod.method == 'ACH2') {
                  this.userpaymentmethodACH2 = userpaymentmethod;
                }
              }
            }
        });

        this.userServ.getMe(token).subscribe(
          (res: any) => {
            console.log('res===', res);
            if (res && res.ok) {
              this.user = res._body;

              this._otcServ.getOrder(this.id).subscribe(
                (res: any) => {
                  if (res.ok) {
                    this.order = res._body;
                    const memberId = this.order.buyerMemberId;
                    if(this.order.paymentMethod == 'CashApp') {
                      this.paymentmethodServ.getUserPaymentMethodsByMemberId(memberId).subscribe(
                        (res: any) => {
                          if (res && res.ok) {
                            const body = res._body;
                            for(let i = 0; i < body.length;i++) {
                              const userpaymentmethod = body[i];
                              if(userpaymentmethod.method == 'CashApp') {
                                this.memberAccountName = userpaymentmethod.details;
                                break;
                              }
                            }
                          }                          
                        }
                      );
                    } else
                    if(this.order.paymentMethod == 'ACH') {
                      this.paymentmethodServ.getUserPaymentMethodsByMemberId(memberId).subscribe(
                        (res: any) => {
                          if (res && res.ok) {
                            const body = res._body;
                            for(let i = 0; i < body.length;i++) {
                              const userpaymentmethod = body[i];
                              if(userpaymentmethod.method == 'ACH') {
                                this.achAccount = userpaymentmethod.details;
                              }
                            }
                          }                          
                        }
                      );
                    } else
                    if(this.order.paymentMethod == 'ACH2') {
                      this.paymentmethodServ.getUserPaymentMethodsByMemberId(memberId).subscribe(
                        (res: any) => {
                          if (res && res.ok) {
                            const body = res._body;

                            for(let i = 0; i < body.length;i++) {
                              const userpaymentmethod = body[i];

                              console.log('userpaymentmethod===', userpaymentmethod);
                              if(userpaymentmethod.method == 'ACH2') {
                                this.achAccount2 = JSON.parse(userpaymentmethod.details);
                                console.log('this.achAccount2==', this.achAccount2);
                              }
                            }
                          }                          
                        }
                      );
                    }                      

                    const coinName = this.order.items[0].title;
          
                    if (coinName === 'BTC') {
                      this.receivingAddress = this.user.walletBtcAddress;
                    } else
                    if (coinName === 'ETH' || coinName === 'USDT') {
                      this.receivingAddress = this.user.walletEthAddress;
                    } else
                    if (coinName === 'FAB' || coinName === 'EXG' || coinName == 'DUSD') {
                      this.receivingAddress = this.user.walletExgAddress;
                    }          
          
                    console.log('this.receivingAddress==', this.receivingAddress);
                  }
                }
              );

            }
          }
        );
      }
    );
    

  }


  changePaymentMethodCashApp() {
    this._otcServ.changePaymentMethod(this.token, this.id, 'CashApp').subscribe(
      (res: any) => {
        console.log('res==', res);
        if(res && res.ok) {
          this.goPayStep = 2;
          window.open("https://cash.app/$exchangily", "_blank");
        }
      }
    );
  }

  changePaymentMethodACH() {
    this._otcServ.changePaymentMethod(this.token, this.id, 'ACH').subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.modalRef.hide();
          this.alertServ.openSnackBarSuccess(
            this.translateServ.instant("Your payment is pending"),
            this.translateServ.instant("Ok")
            );
        }
      }
    );
  }
 
  changePaymentMethodACH2() {
    this._otcServ.changePaymentMethod(this.token, this.id, 'ACH2').subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.goPayStep = 2;
          //this.modalRef.hide();
          /*
          this.alertServ.openSnackBarSuccess(
            this.translateServ.instant("Your payment is pending"),
            this.translateServ.instant("Ok")
            );
          */
        }
      }
    );
  }

  changePaymentStatus(paymentStatus) {
    this._otcServ.changePaymentStatus(this.token, this.id, paymentStatus).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.goPayStep = 3;
        }
      }
    );
  }

  payByACH(template) {
    this.modalRef = this.modalService.show(template);
  }

  payByACH2(template) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }
  confirmCashAppPay() {
    const data = {
      method: 'CashApp',
      details: this.accountName
    }

    if(!this.userpaymentmethodCashApp) {
      this.paymentmethodServ.addUserPaymentmethod(this.token, data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.changePaymentMethodCashApp();
          }
        }
      );
    } else {
      if(this.accountName == this.userpaymentmethodCashApp.details) {
        this.changePaymentMethodCashApp();
      } else {
        this.paymentmethodServ.updateUserPaymentmethod(this.token, this.userpaymentmethodCashApp._id, data).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.changePaymentMethodCashApp();
            }
          }
        );
      }
      
    }


  }
  payByCashApp(template) {
    this.modalRef = this.modalService.show(template);
  }


  decryptAccount() {
    this.achAccountBundle = this.utilServ.decrypt(this.privateKey, this.achAccount);
    console.log('achAccountBundle=',this.achAccountBundle);
    if(this.achAccountBundle) {
      this.achAccountBundle = JSON.parse(this.achAccountBundle);
    }
    console.log('achAccountBundle=',this.achAccountBundle);
  }

  decrypt(template) {
    this.modalRef = this.modalService.show(template);
  }

  achCheckedChange(event) {
    this.achChecked = !this.achChecked;
  }

  confirmACHPay() {
    const rawData = '{"routingNumber":"' + this.routingNumber + '","accountNumber":"' + this.accountNumber + '"}';
    const data = {
      method: 'ACH',
      details: this.utilServ.encrypt(environment.PUBLIC_KEY, rawData)
    }

    console.log('this.userpaymentmethodACH==', this.userpaymentmethodACH);
    if(!this.userpaymentmethodACH) {
      this.paymentmethodServ.addUserPaymentmethod(this.token, data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.changePaymentMethodACH();
          }
        }
      );
    } else {
      this.paymentmethodServ.updateUserPaymentmethod(this.token, this.userpaymentmethodACH._id, data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.changePaymentMethodACH();
          }
        }
      );
      
    }
  }

  confirmACHPay2() {
    const rawData = {
      customerName: this.customerName,
      companyName: this.companyName,
      billingAddress: this.billingAddress,
      city: this.city,
      country: this.country,
      state: this.state,
      zip: this.zip,
      email: this.email,
      phone: this.phone
    };
    const data = {
      method: 'ACH2',
      details: JSON.stringify(rawData)
    }

    if(!this.userpaymentmethodACH2) {
      this.paymentmethodServ.addUserPaymentmethod(this.token, data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.changePaymentMethodACH2();
          }
        }
      );
    } else {
      this.paymentmethodServ.updateUserPaymentmethod(this.token, this.userpaymentmethodACH2._id, data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.changePaymentMethodACH2();
          }
        }
      );
      
    }
  }

  payByEpay() {
    const currency = this.order.currency;
    if (!this.order.totalToPay) {
      return;
    }
    const amount = this.order.totalToPay;

    const paymentAmount = amount;
    const paymentUnit = currency;
    this.apiServ.getEpayHash(paymentAmount, paymentUnit).subscribe(
      (ret: any) => {
        if (ret && ret.ok) {

          const paymentId = 'otc_' + this.id;


          const data = ret._body;
          const hash = data.hash;
          const payeeAccount = data.payeeAccount;
          console.log('hash=', hash);
          const mapForm = document.createElement('form');
          mapForm.method = 'POST';
          mapForm.target = '_blank';
          mapForm.action = `${environment.EPAY_API}/merReceive`;
          mapForm.style.display = 'none';

          const mapInput = document.createElement('input');
          mapInput.type = 'hidden';
          mapInput.name = 'PAYEE_ACCOUNT';
          mapInput.value = payeeAccount;
          mapForm.appendChild(mapInput);


          const mapInput1 = document.createElement('input');
          mapInput1.type = 'hidden';
          mapInput1.name = 'PAYEE_NAME';
          mapInput1.value = this.order.merchantId.name;
          mapForm.appendChild(mapInput1);

          const mapInput2 = document.createElement('input');
          mapInput2.type = 'hidden';
          mapInput2.name = 'PAYMENT_AMOUNT';
          mapInput2.value = paymentAmount.toString();
          mapForm.appendChild(mapInput2);

          const mapInput3 = document.createElement('input');
          mapInput3.type = 'hidden';
          mapInput3.name = 'PAYMENT_UNITS';
          mapInput3.value = paymentUnit;
          mapForm.appendChild(mapInput3);


          const mapInput5 = document.createElement('input');
          mapInput5.type = 'hidden';
          mapInput5.name = 'STATUS_URL';
          mapInput5.value = environment.endpoints.blockchaingate + 'epay/callback';
          mapForm.appendChild(mapInput5);


          const mapInput6 = document.createElement('input');
          mapInput6.type = 'hidden';
          mapInput6.name = 'PAYMENT_URL';
          mapInput6.value = environment.baseUrl + '/home/paymentsuccess';
          mapForm.appendChild(mapInput6);

          const mapInput7 = document.createElement('input');
          mapInput7.type = 'hidden';
          mapInput7.name = 'NOPAYMENT_URL';
          mapInput7.value = environment.baseUrl + '/home/paymentfail';
          mapForm.appendChild(mapInput7);

          const mapInput8 = document.createElement('input');
          mapInput8.type = 'hidden';
          mapInput8.name = 'PAYMENT_ID';
          mapInput8.value = paymentId;
          mapForm.appendChild(mapInput8);


          const mapInput9 = document.createElement('input');
          mapInput9.type = 'hidden';
          mapInput9.name = 'V2_HASH';
          mapInput9.value = hash;
          mapForm.appendChild(mapInput9);


          const mapInput10 = document.createElement('input');
          mapInput10.type = 'hidden';
          mapInput10.name = 'SUGGESTED_MEMO';
          const coinName = this.order.items[0].title;
          mapInput10.value = this.user.email + ' buy ' + this.order.items[0].quantity + coinName + ' with ' + paymentAmount + paymentUnit + '(receiving address:';
          mapInput10.value += this.order.name;
          mapInput10.value += ')';
          mapForm.appendChild(mapInput10);



          document.body.appendChild(mapForm);

          mapForm.submit();
        }
      }
    );
  }
}