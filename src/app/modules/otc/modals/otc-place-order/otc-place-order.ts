import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import {Token} from '../../../../interfaces/kanban.interface';

@Component({
    selector: 'otc-place-order-modal',
    templateUrl: './otc-place-order.modal.html',
    styleUrls: ['./otc-place-order.modal.css']
})
export class OtcPlaceOrderModal {
    @ViewChild('otcPlaceOrderModal', {static: true}) public otcPlaceOrderModal: ModalDirective;
}
