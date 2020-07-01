import { Component, ViewChild} from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { TransactionItem } from '../../../../models/transaction-item';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'transaction-detail2-modal',
    templateUrl: './transaction-detail2.modal.html',
    styleUrls: ['./transaction-detail2.modal.css']
})
export class TransactionDetailModal2 {
    @ViewChild('transactionDetailModal2', {static: true}) public transactionDetailModal2: ModalDirective;
    item: any;
    utilService: UtilService;

    constructor (_utilServ: UtilService) {
        this.utilService = _utilServ;
    }

    show(item: any) {
        this.item = item;
        console.log('this.item=', this.item);
        this.transactionDetailModal2.show();
    }

    hide() {
        this.transactionDetailModal2.hide();
    }    
}
