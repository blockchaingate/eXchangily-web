import { Component, OnInit, Input } from '@angular/core';
import {StorageService} from '../../../../services/storage.service';
import { TransactionItem } from '../../../../models/transaction-item';
import {CoinsPrice} from '../../../../interfaces/balance.interface';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

    transactionHistory: TransactionItem[];
    @Input() coinsPrice: CoinsPrice;
    constructor ( private storageService: StorageService, private utilService: UtilService ) {

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
