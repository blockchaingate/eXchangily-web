import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TransactionItem } from '../../../../models/transaction-item';
import { UtilService } from '../../../../services/util.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'transaction-detail-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, TranslateModule],
    templateUrl: './transaction-detail.modal.html',
    styleUrls: ['./transaction-detail.modal.css']
})
export class TransactionDetailModal {
    @ViewChild('transactionDetailModal', { static: true }) public transactionDetailModal: ModalDirective = {} as ModalDirective;
    item: TransactionItem = new TransactionItem();

    constructor(private _utilServ: UtilService) {
    }

    show(item: TransactionItem) {
        this.item = item;
        this.transactionDetailModal.show();
    }

    hide() {
        this.transactionDetailModal.hide();
    }

    getFormattedTxid(txid: string): string {
        return this._utilServ.stripHexPrefix(txid);
    }
}
