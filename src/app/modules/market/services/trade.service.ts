import { StorageMap } from '@ngx-pwa/local-storage';
import { Transaction } from '../../../interfaces/kanban.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class TradeService {

    constructor(private localSt: StorageMap) {
    }

    saveTransactions(transactions: Transaction[]) {
        return this.localSt.set('mytransactions', transactions).subscribe(() => {
            console.log('delete successfully.');
        });
    }

    getTransactions() {
        return this.localSt.get('mytransactions');
    }

}
