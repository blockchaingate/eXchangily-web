import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'wallet-update-modal',
    standalone: true,
    imports: [ModalDirective, TranslateModule],
    templateUrl: './wallet-update.modal.html',
    styleUrls: ['./wallet-update.modal.scss']
})
export class WalletUpdateModal {
    @ViewChild('walletUpdateModal', { static: true }) public walletUpdateModal: ModalDirective = {} as ModalDirective;
    @Output() confirmWalletUpdate = new EventEmitter();

    constructor() { }

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
