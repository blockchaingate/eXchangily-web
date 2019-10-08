import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TransactionItem } from '../models/transaction-item';

@Injectable()
export class StorageService {
    constructor(private localSt: LocalStorage) {

    }

    storeToTransactionHistoryList(transactionItem: TransactionItem) {
        this.localSt.getItem('transaction-history').subscribe((transactionHistory: TransactionItem[]) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            transactionHistory.push(transactionItem);
            console.log('transactionHistory for storeToTransactionHistoryList=', transactionHistory);
            return this.localSt.setItem('transaction-history', transactionHistory).subscribe(() => {});
        });
    }  
    
    getTransactionHistoryList() {
        return this.localSt.getItem('transaction-history');
    }    
}
