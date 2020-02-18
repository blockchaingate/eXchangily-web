import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { faAlipay } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'otc-place-order-modal',
    templateUrl: './otc-place-order.html',
    styleUrls: ['./otc-place-order.css']
})
export class OtcPlaceOrderModal {
    faAlipay = faAlipay;
    faCreditCard = faCreditCard;

    @ViewChild('otcPlaceOrderModal', {static: true}) public otcPlaceOrderModal: ModalDirective;
    methods: string[] = ['alipay', 'bank'];
    show() {
        this.otcPlaceOrderModal.show();
    }

    hide() {
        this.otcPlaceOrderModal.hide();
    }    
}
