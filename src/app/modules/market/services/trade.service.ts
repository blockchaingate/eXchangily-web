import { LocalStorage } from '@ngx-pwa/local-storage';
import {Transaction} from '../../../interfaces/kanban.interface';
export class TradeService {
    
    constructor(private localSt: LocalStorage) {
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
