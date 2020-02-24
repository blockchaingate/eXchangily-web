import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { faAlipay } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'confirm-payment-modal',
    templateUrl: './confirm-payment.html',
    styleUrls: ['./confirm-payment.css']
})
export class ConfirmPaymentModal {
    faAlipay = faAlipay;
    faCreditCard = faCreditCard;
    confirmPaymentModalForm = this.fb.group({
        quantity: ['0'],
        amount: ['0'],
        method: ['alipay']
    });
    @ViewChild('confirmPaymentModal', {static: true}) public confirmPaymentModal: ModalDirective;
    

    methods: string[] = ['alipay', 'bank'];
    constructor(private fb: FormBuilder) { }
    show() {
        this.confirmPaymentModal.show();
    }

    hide() {
        this.confirmPaymentModal.hide();
    }    
    onSubmit() {
        
    }
}
