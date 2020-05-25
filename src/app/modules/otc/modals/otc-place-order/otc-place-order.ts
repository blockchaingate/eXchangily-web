import { Component, ViewChild, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { StripeToken, StripeSource, StripeCard, StripeCardOptions } from 'stripe-angular'
import { environment } from 'src/environments/environment';
import { StripeScriptTag } from 'stripe-angular'
import {
    IPayPalConfig,
    ICreateOrderRequest
} from 'ngx-paypal';

@Component({
    selector: 'otc-place-order-modal',
    templateUrl: './otc-place-order.html',
    styleUrls: ['./otc-place-order.css']
})
export class OtcPlaceOrderModal {
    public payPalConfig: any;
    @Input() balance: number;
    token: string;
    @Output() confirmed = new EventEmitter<any>();
    @ViewChild('stripeCard', { static: true }) stripeCard: StripeCard;
    element: any;
    amount: number;
    quantity: number;
    invalidError ={message: ''};
    // selectedMethod: string;

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

    faPaypal = faPaypal;
    options: any;
    faCreditCard = faCreditCard;

    @ViewChild('otcPlaceOrderModal', { static: true }) public otcPlaceOrderModal: ModalDirective;
    methods: string[] = ['Paypal', 'CreditCard'];

    constructor(public StripeScriptTag: StripeScriptTag) {
        this.StripeScriptTag.setPublishableKey(environment.STRIPE_PUBLIC_KEY);
        this.options = {
            hidePostalCode: true
        };
    }
    show(element) {
        this.element = element;
        this.otcPlaceOrderModal.show();
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
    }

    onSubmit() {
        // this.stripeCard.createToken(this.extraData);
        this.hide();

        console.log('token=', this.token);
        const data = {
            amount: this.amount,
            quantity: this.quantity,
            method: this.selectedMethod,
            token: this.token
        };
        this.confirmed.emit(data);
        console.log('2');
    }





    extraData = {
        'name': '',
        'address_city': '',
        'address_line1': '',
        'address_line2': '',
        'address_state': '',
        'address_zip': ''
    }

    onStripeInvalid(error: Error) {
        console.log('Validation Erroree', error)
    }

    setStripeToken(token: StripeToken) {
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

    setStripeSource(source: StripeSource) {
        console.log('Stripe sourceee', source)
    }

    onStripeError(error: Error) {
        console.error('Stripe erroree', error)
    }

}
