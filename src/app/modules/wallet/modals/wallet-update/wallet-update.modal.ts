import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'wallet-update-modal',
    templateUrl: './wallet-update.modal.html',
    styleUrls: ['./wallet-update.modal.scss']
})
export class WalletUpdateModal {
    @ViewChild('walletUpdateModal', {static: true}) public walletUpdateModal: ModalDirective;
    @Output() confirmWalletUpdate= new EventEmitter();
    constructor() {

    }

    show() {
        this.walletUpdateModal.show();
    }
    hide() {
        this.walletUpdateModal.hide();
    }

    confirm() {
        this.hide();
        this.confirmWalletUpdate.emit();
    }
}
