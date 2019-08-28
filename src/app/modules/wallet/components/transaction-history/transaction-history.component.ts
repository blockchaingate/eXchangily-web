import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {StorageService} from '../../../../services/storage.service';
import { TransactionItem } from '../../../../models/transaction-item';
import {CoinsPrice} from '../../../../interfaces/balance.interface';
import {UtilService} from '../../../../services/util.service';
import { TransactionDetailModal } from '../../modals/transaction-detail/transaction-detail.modal';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

    @ViewChild('transactionDetailModal', {static: true}) transactionDetailModal: TransactionDetailModal;


    transactionHistory: TransactionItem[];
    @Input() coinsPrice: CoinsPrice;
    constructor ( private storageService: StorageService, private utilServ: UtilService ) {

    }
    
    ngOnInit() {
        this.storageService.getTransactionHistoryList().subscribe(
            (transactionHistory: TransactionItem[]) => {
                console.log('transactionHistory=', transactionHistory);
                this.transactionHistory = transactionHistory;
            }
        );
    }

    showTransactionDetail(item: TransactionItem) {
        this.transactionDetailModal.show(item);
    }
}
