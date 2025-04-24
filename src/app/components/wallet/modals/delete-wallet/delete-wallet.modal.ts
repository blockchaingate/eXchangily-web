import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'delete-wallet-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, ReactiveFormsModule, TranslateModule],
    templateUrl: './delete-wallet.modal.html',
    styleUrls: ['./delete-wallet.modal.css']
})
export class DeleteWalletModal {
    @ViewChild('deleteWalletModal', {static: true}) public deleteWalletModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedDeleteWallet = new EventEmitter();

    deleteWalletForm: FormGroup = {} as FormGroup;    

    constructor(private fb: FormBuilder) {
        this.deleteWalletForm = this.fb.group({
        });        
    }

    onSubmit() {
        this.confirmedDeleteWallet.emit();
        this.hide();
    }

    show() {
        this.deleteWalletModal.show();
    }

    hide() {
        this.deleteWalletModal.hide();
    }
}
