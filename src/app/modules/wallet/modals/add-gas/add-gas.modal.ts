import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'add-gas-modal',
    templateUrl: './add-gas.modal.html',
    styleUrls: ['./add-gas.modal.css']
})
export class AddGasModal {
    @ViewChild('addGasModal', {static: true}) public addGasModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedGas = new EventEmitter<number>();

    depositAmountForm = this.fb.group({
        depositAmount: ['']
    });    

    constructor(private fb: FormBuilder) {
    }

    onSubmit() {
        const depositAmount = this.depositAmountForm.value.depositAmount;
        const amount = Number(depositAmount);
        this.confirmedGas.emit(amount);
        this.hide();
    }

    show() {
        this.addGasModal.show();
    }
    hide() {
        this.addGasModal.hide();
    }
}