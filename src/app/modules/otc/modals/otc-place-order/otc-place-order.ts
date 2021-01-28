import { Component, ViewChild, EventEmitter, Output, Input, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../../../../services/api.service';
//import { StripeToken, StripeSource, StripeCard } from 'stripe-angular'
import { environment } from '../../../../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { StripeScriptTag } from 'stripe-angular'
/*
import {
    IPayPalConfig,
    ICreateOrderRequest
} from 'ngx-paypal';
*/
declare var SqPaymentForm: any; // magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'otc-place-order-modal',
  templateUrl: './otc-place-order.html',
  styleUrls: ['./otc-place-order.css']
})
export class OtcPlaceOrderModal implements OnInit, AfterViewInit {
  public payPalConfig: any;
  @Input() balance: number;
  @Output() confirmed = new EventEmitter<any>();
  @ViewChild('stripeCard', { static: true }) stripeCard;
  element: any;
  user_id: string;
  amount: number;
  user: any;
  quantity: number;
  invalidError = { message: '' };
  // selectedMethod: string;
  paymentForm; // this is our payment form object

  extraData = {
    'name': '',
    'address_city': '',
    'address_line1': '',
    'address_line2': '',
    'address_state': '',
    'address_zip': ''
  };

  _selectedMethod: string;
  get selectedMethod(): string {
    return this._selectedMethod;
  }
  set selectedMethod(value: string) {
    this._selectedMethod = value;
    if (value === 'Paypal') {
      this.enablePaypal();
    }
  }

  options: any;

  @ViewChild('otcPlaceOrderModal', { static: true }) public otcPlaceOrderModal: ModalDirective;
  methods: string[] = ['Paypal', 'CreditCard'];

  constructor(private apiServ: ApiService) {
    // this.StripeScriptTag.setPublishableKey(environment.STRIPE_PUBLIC_KEY);
    this.options = {
      hidePostalCode: true
    };
    this.selectedMethod = 'CreditCard';
  }

  show(user, element) {
    this.element = element;
    this.user_id = user._id;
    this.user = user;
    this.otcPlaceOrderModal.show();

    const applicationId = environment.SQUARE_APP_ID[this.element.fiat];

    const that = this;
    this.paymentForm = new SqPaymentForm({
      // postalCode: false,
      applicationId: applicationId,
      inputClass: 'sq-input',
      cardNumber: {
        elementId: 'sq-card-number',
        placeholder: 'Card Number'
      },
      cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
      },
      postalCode: {
        elementId: 'sq-postal-code',
        placeholder: 'Postal'
      },
      // SqPaymentForm callback functions
      callbacks: {

        cardNonceResponseReceived: function (errors, nonce, cardData) {
          const data = {
            amount: that.amount,
            quantity: that.quantity,
            method: that.selectedMethod,
            charge_id: nonce
          };
          that.confirmed.emit(data);
        }
      }
    });

    this.paymentForm.build();
    console.log('this.paymentForm===', this.paymentForm);
  }

  hide() {
    this.otcPlaceOrderModal.hide();
  }

  changeQuantity(quantity: number) {
    this.amount = quantity * this.element.price;
  }

  changeAmount(amount: number) {
    this.quantity = amount / this.element.price;
  }

  enablePaypal() {
    /*
    console.log('enablePaypal====');
    const currency = this.element.fiat;
    if (!this.amount) {
        return;
    }
    const amount = this.amount.toString();

    console.log('amount=', amount);
    console.log('currency=', currency);
    this.payPalConfig = {
        currency: currency,
        clientId: environment.PAYPAL_CLIENT_ID,
        createOrder: (data) => <ICreateOrderRequest>{
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount,
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: amount
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: currency,
                        value: amount,
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            // this.showSuccess = true;
            const orderID = data.id;
            console.log('orderID===', orderID);
            if (orderID) {
                this.hide();
                const data = {
                    amount: this.amount,
                    quantity: this.quantity,
                    method: this.selectedMethod,
                    charge_id: orderID
                };
                this.confirmed.emit(data);
            }

        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            // this.showCancel = true;

        },
        onError: err => {
            console.log('OnError', err);
            // this.showError = true;
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            // this.resetStatus();
        },
    };
    */
  }

  onSubmit() {
    // this.stripeCard.createToken(this.extraData);
    this.hide();


    if(this.element.buy) {
      const data = {
        amount: this.amount,
        quantity: this.quantity,
        method: this.selectedMethod
      };
      this.confirmed.emit(data);  
      return;    
    }
    const currency = this.element.fiat;
    if (!this.amount) {
        return;
    }
    const amount = this.amount;

    const paymentAmount = amount;
    const paymentUnit = currency;    
    this.apiServ.getEpayHash(paymentAmount, paymentUnit).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {

          const paymentId = 'otc_' + this.user_id  + '_' + Date.now();
          const confirmedData = {
            amount: this.amount,
            quantity: this.quantity,
            charge_id: paymentId,
            method: 'Epay'
          };
          this.confirmed.emit(confirmedData);

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
          mapInput1.value = this.element.merchant.merchantName;
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
          mapInput6.value = environment.baseUrl + '/paymentsuccess';
          mapForm.appendChild(mapInput6);
      
          const mapInput7 = document.createElement('input');
          mapInput7.type = 'hidden';
          mapInput7.name = 'NOPAYMENT_URL';
          mapInput7.value = environment.baseUrl + '/paymentfail';
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
          console.log('user=', this.user);
          mapInput10.value = this.user.email + ' buy ' + this.quantity + this.element.coin + ' with ' + paymentAmount + paymentUnit + '(receiving address:';
          if(this.element.coin == 'BTC') {
            mapInput10.value += this.user.walletBtcAddress;
          } else 
          if(this.element.coin == 'ETH' || this.element.coin == 'USDT') {
            mapInput10.value += this.user.walletEthAddress;
          } else 
          if(this.element.coin == 'FAB' || this.element.coin == 'EXG') {
            mapInput10.value += this.user.walletExgAddress;
          }
          mapInput10.value +=  ')';
          mapForm.appendChild(mapInput10);                
       
      
      
          document.body.appendChild(mapForm);
          
          mapForm.submit();
        }
      }
    );



    //this.paymentForm.requestCardNonce();
    /*
    console.log('token=', this.token);
    const data = {
        amount: this.amount,
        quantity: this.quantity,
        method: this.selectedMethod,
        token: this.token
    };
    this.confirmed.emit(data);
    console.log('2');
    */
  }

  /*
  onStripeInvalid(error: Error) {
    console.log('Validation Erroree', error);
  }

  setStripeToken(token) {
    this.hide();
    this.token = token.id;
    const data = {
      amount: this.amount,
      quantity: this.quantity,
      method: this.selectedMethod,
      charge_id: this.token
    };
    this.confirmed.emit(data);
  }

  setStripeSource(source) {
    console.log('Stripe sourceee', source);
  }

  onStripeError(error: Error) {
    console.error('Stripe erroree', error);
  }
  */
  ngOnInit() {
    // Set the application ID

    /*
    this.paymentForm = new SqPaymentForm({
 
      // Initialize the payment form elements
      applicationId: applicationId,
      locationId: locationId,
      inputClass: 'sq-input',
    
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [{
          fontSize: '.9em'
      }],
    
    
    
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: 'sq-card-number',
        placeholder: '•••• •••• •••• ••••'
      },
      cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
      },
      postalCode: {
        elementId: 'sq-postal-code'
      },
    
      // SqPaymentForm callback functions
      callbacks: {

        methodsSupported: function (methods) {
    
          var applePayBtn = document.getElementById('sq-apple-pay');
          var applePayLabel = document.getElementById('sq-apple-pay-label');
          var masterpassBtn = document.getElementById('sq-masterpass');
          var masterpassLabel = document.getElementById('sq-masterpass-label');
    
          // Only show the button if Apple Pay for Web is enabled
          // Otherwise, display the wallet not enabled message.
          if (methods.applePay === true) {
            applePayBtn.style.display = 'inline-block';
            applePayLabel.style.display = 'none' ;
          }
          // Only show the button if Masterpass is enabled
          // Otherwise, display the wallet not enabled message.
          if (methods.masterpass === true) {
            masterpassBtn.style.display = 'inline-block';
            masterpassLabel.style.display = 'none';
          }
        },
    

        createPaymentRequest: function () {
          // The payment request below is provided as
          // guidance. You should add code to create the object
          // programmatically.
          return {
            requestShippingAddress: true,
            currencyCode: "USD",
            countryCode: "US",
            total: {
              label: "Hakuna",
              amount: "{{REPLACE_ME}}",
              pending: false,
            },
            lineItems: [
              {
                label: "Subtotal",
                amount: "{{REPLACE_ME}}",
                pending: false,
              },
              {
                label: "Shipping",
                amount: "{{REPLACE_ME}}",
                pending: true,
              },
              {
                label: "Tax",
                amount: "{{REPLACE_ME}}",
                pending: false,
              }
            ]
          };
        },

        cardNonceResponseReceived: function (errors, nonce, cardData)  {
          if (errors) {
            // Log errors from nonce generation to the Javascript console
            console.log("Encountered errors:");
            errors.forEach(function(error) {
              console.log('  ' + error.message);
            });
    
            return;
          }
    
          alert('Nonce received: ' + nonce); 
    
          // Assign the nonce value to the hidden form field
          // document.getElementById('card-nonce').value = nonce;
          //needs to be extracted from the
          (<HTMLInputElement>document.getElementById('card-nonce')).value = nonce; //casting so .value will work
          //get this value from the database when the user is logged in
          (<HTMLInputElement>document.getElementById('sq-id')).value = "CBASEC8F-Phq5_pV7UNi64_kX_4gAQ";
    
          // POST the nonce form to the payment processing page
          (<HTMLFormElement>document.getElementById('nonce-form')).submit();
    
        },

        unsupportedBrowserDetected: function() {
        },

        inputEventReceived: function(inputEvent) {
          switch (inputEvent.eventType) {
            case 'focusClassAdded':
              break;
            case 'focusClassRemoved':
              break;
            case 'errorClassAdded':
              break;
            case 'errorClassRemoved':
              break;
            case 'cardBrandChanged':
              break;
            case 'postalCodeChanged':
              break;
          }
        },

        paymentFormLoaded: function() {
        }
      }
    });
     */
  }

  requestCardNonce(event) {

    // Don't submit the form until SqPaymentForm returns with a nonce
    // event.preventDefault();

    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce();
  }

  ngAfterViewInit() {
  }

  onGetCardNonce(event) {
    console.log('event111=', event);
    console.log('111');
    const token = this.paymentForm.requestCardNonce();
    console.log('token==', token);
    console.log('333');
  }

}
