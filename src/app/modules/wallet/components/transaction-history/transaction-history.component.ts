import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../../../services/storage.service';
import { TransactionItem } from '../../../../models/transaction-item';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

    transactionHistory: TransactionItem[];

    constructor ( private storageService: StorageService ) {

    }
    
    ngOnInit() {
        this.storageService.getTransactionHistoryList().subscribe(
            (transactionHistory: TransactionItem[]) => {
                console.log('transactionHistory=', transactionHistory);
                this.transactionHistory = transactionHistory;
            }
        );
    }
}
