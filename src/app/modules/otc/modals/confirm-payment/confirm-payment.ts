import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'confirm-payment-modal',
    templateUrl: './confirm-payment.html',
    styleUrls: ['./confirm-payment.css']
})
export class ConfirmPaymentModal {
    confirmPaymentModalForm = this.fb.group({
        quantity: ['0'],
        amount: ['0'],
        method: ['alipay']
    });
    @ViewChild('confirmPaymentModal', { static: true }) public confirmPaymentModal: ModalDirective = {} as ModalDirective;

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
