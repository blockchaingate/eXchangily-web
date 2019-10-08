import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'withdraw-amount-modal',
    templateUrl: './withdraw-amount.modal.html',
    styleUrls: ['./withdraw-amount.modal.css']
})
export class WithdrawAmountModal {
    @ViewChild('withdrawModal', {static: true}) public withdrawModal: ModalDirective;
    @Output() confirmedAmount = new EventEmitter<number>();

    withdrawAmountForm = this.fb.group({
        withdrawAmount: ['']
    });    

    constructor(private fb: FormBuilder) {

    }

    onSubmit() {
        const withdrawAmount = this.withdrawAmountForm.get('withdrawAmount').value;
        const amount = Number(withdrawAmount);
        this.confirmedAmount.emit(amount);
        this.hide();
    }

    show() {
        this.withdrawModal.show();
    }
    hide() {
        this.withdrawModal.hide();
    }
}
