import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TransactionItem } from '../models/transaction-item';
import {Subject} from 'rxjs/Subject';   

@Injectable()
export class StorageService {
    newTransaction = new Subject();
    changedTransaction = new Subject();
    constructor(private localSt: LocalStorage) {

    }

    notifyTransactionItemChanged(transactionItem: TransactionItem) {
        this.changedTransaction.next(transactionItem);
    }

    storeToTransactionHistoryList(walletId: string, transactionItem: TransactionItem) {
        this.newTransaction.next(transactionItem);
        this.getTransactionHistoryList(walletId).subscribe((transactionHistory: TransactionItem[]) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            transactionHistory.push(transactionItem);
            console.log('transactionHistory for storeToTransactionHistoryList=', transactionHistory);
            return this.localSt.setItem('transactions-' + walletId, transactionHistory).subscribe(() => {});
        });
    }  
    
    getTransactionHistoryList(walletId: string) {
        return this.localSt.getItem('transactions-' + walletId);
    }    
}
