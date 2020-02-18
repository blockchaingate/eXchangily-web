import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'otc-place-order-modal',
    templateUrl: './otc-place-order.html',
    styleUrls: ['./otc-place-order.css']
})
export class OtcPlaceOrderModal {
    @ViewChild('otcPlaceOrderModal', {static: true}) public otcPlaceOrderModal: ModalDirective;
    
    show() {
        this.otcPlaceOrderModal.show();
    }

    hide() {
        this.otcPlaceOrderModal.hide();
    }    
}
