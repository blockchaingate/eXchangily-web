import { LocalStorage } from '@ngx-pwa/local-storage';
import {Transaction} from '../../../interfaces/kanban.interface';
export class TradeService {

    constructor(private localSt: LocalStorage) {
    }

    addTransaction(tx: Transaction) {
        this.localSt.getItem('mytransactions').subscribe((transactions: Transaction[]) => {
            if (!transactions) {
                transactions = [];
            }
            transactions.push(tx);
            console.log('transactions before setItem');
            console.log(transactions);
            return this.localSt.setItem('mytransactions', transactions).subscribe(() => {
                console.log('set successfully.');
            });
        });
    }

    saveTransactions(transactions: Transaction[]) {
        return this.localSt.setItem('mytransactions', transactions).subscribe(() => {
            console.log('delete successfully.');
        });     
    }

    getTransactions() {
        return this.localSt.getItem('mytransactions');
    }
    
}
