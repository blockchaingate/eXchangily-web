import { Component, ViewChild} from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { TransactionItem } from '../../../../models/transaction-item';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'transaction-detail-modal',
    templateUrl: './transaction-detail.modal.html',
    styleUrls: ['./transaction-detail.modal.css']
})
export class TransactionDetailModal {
    @ViewChild('transactionDetailModal', {static: true}) public transactionDetailModal: ModalDirective;   
    item: TransactionItem;

    constructor ( private utilService: UtilService ) {

    }    
    show(item: TransactionItem) {
        this.item = item;
        if (item.coin === 'ETH') {

        }
        this.transactionDetailModal.show();
    }

    hide() {
        this.transactionDetailModal.hide();
    }    
}
