import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { faAlipay } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'otc-place-order-modal',
    templateUrl: './otc-place-order.html',
    styleUrls: ['./otc-place-order.css']
})
export class OtcPlaceOrderModal {
    @Output() confirmed = new EventEmitter<any>();
    element: any;
    amount: number;
    quantity: number;
    method: string;
    faAlipay = faAlipay;
    faCreditCard = faCreditCard;

    @ViewChild('otcPlaceOrderModal', { static: true }) public otcPlaceOrderModal: ModalDirective;
    methods: string[] = ['alipay', 'bank'];

    constructor() { }
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

    onSubmit() {
        this.hide();

        const data = {
            amount: this.amount,
            quantity: this.quantity,
            method: this.method
        };
        this.confirmed.emit(data);
        console.log('2');
    }
}
