import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'add-gas-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, ReactiveFormsModule, TranslateModule],
    templateUrl: './add-gas.modal.html',
    styleUrls: ['./add-gas.modal.css']
})
export class AddGasModal {
    @ViewChild('addGasModal', {static: true}) public addGasModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedGas = new EventEmitter<number>();
    depositAmountForm = {} as FormGroup   

    constructor(private fb: FormBuilder) {
        this.depositAmountForm = this.fb.group({
            depositAmount: ['']
        });    
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