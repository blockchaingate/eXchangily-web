import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { AlertService } from '../../../../services/alert.service';
@Component({
    selector: 'deposit-amount-modal',
    templateUrl: './deposit-amount.modal.html',
    styleUrls: ['./deposit-amount.modal.css']
})
export class DepositAmountModal {
    @ViewChild('depositModal', {static: true}) public depositModal: ModalDirective;
    @Input() coin: MyCoin;
    @Output() confirmedAmount = new EventEmitter<number>();

    depositAmountForm = this.fb.group({
        depositAmount: ['']
    });    

    constructor(private fb: FormBuilder, private alertServ: AlertService) {
    }

    onSubmit() {
        const depositAmount = this.depositAmountForm.get('depositAmount').value;
        const amount = Number(depositAmount);
        // console.log('amount=', amount);
        if ((amount <= 0) || Number.isNaN(amount)) {
            this.alertServ.openSnackBar('Please provide the right amount for deposit.', 'Ok');
            return;            
        }
        if (amount > this.coin.balance) {
            this.alertServ.openSnackBar('No enough balance for deposit.', 'Ok');
            return;
        }
        this.depositAmountForm.patchValue(
            {depositAmount: ''}
        );
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
