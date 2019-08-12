import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'deposit-amount-modal',
    templateUrl: './deposit-amount.modal.html',
    styleUrls: ['./deposit-amount.modal.css']
})
export class DepositAmountModal {
    @ViewChild('depositModal', {static: true}) public depositModal: ModalDirective;
    @Output() confirmedAmount = new EventEmitter<number>();

    depositAmountForm = this.fb.group({
        depositAmount: ['']
    });    

    constructor(private fb: FormBuilder) {

    }

    onSubmit() {
        const depositAmount = this.depositAmountForm.get('depositAmount').value;
        const amount = Number(depositAmount);
        this.confirmedAmount.emit(amount);
        this.hide();
    }

    show() {
        this.depositModal.show();
    }
    hide() {
        this.depositModal.hide();
    }
}
