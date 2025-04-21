import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'delete-wallet-modal',
    templateUrl: './delete-wallet.modal.html',
    styleUrls: ['./delete-wallet.modal.css']
})
export class DeleteWalletModal {
    @ViewChild('deleteWalletModal', { static: true }) public deleteWalletModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedDeleteWallet = new EventEmitter();

    deleteWalletForm = this.fb.group({
    });

    constructor(private fb: FormBuilder) {
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
