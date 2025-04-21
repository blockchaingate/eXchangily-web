import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { TransactionItem } from '../../../../models/transaction-item';
import { CoinsPrice } from '../../../../interfaces/balance.interface';
import { UtilService } from '../../../../services/util.service';
import { ApiService } from '../../../../services/api.service';
import { KanbanService } from '../../../../services/kanban.service';
import { TransactionDetailModal } from '../../modals/transaction-detail/transaction-detail.modal';
import { TransactionDetailModal2 } from '../../modals/transaction-detail2/transaction-detail2.modal';
import { CoinService } from '../../../../services/coin.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
    @ViewChild('transactionDetailModal', { static: true }) transactionDetailModal: TransactionDetailModal = {} as TransactionDetailModal;
    @ViewChild('transactionDetailModal2', { static: true }) transactionDetailModal2: TransactionDetailModal2 = {} as TransactionDetailModal2;

    @Input() coinsPrice: CoinsPrice = {} as CoinsPrice;
    @Input() walletId = '';
    @Input() transactions: TransactionItem[] = [];

    currentChain = '';

    constructor(
        private coinServ: CoinService,
        private storageService: StorageService,
        private apiServ: ApiService,
        utilServ: UtilService,
        private kanbanServ: KanbanService
    ) {
    }

    showCoinName(name: string, chain: string) {
        if((name != chain) && chain) {
            return name + '(' + chain + ')';
        }
        return name;
    }
    mergeSortedArray(a: TransactionItem[], b: TransactionItem[]): TransactionItem[] {
        if (!a) {
            return b;
        } else if (!b) {
            return a;
        }
        const tempArray: TransactionItem[] = [];
        const currentPos: { a: number; b: number } = {
            a: 0,
            b: 0
        };
        while (currentPos.a < a.length && currentPos.b < b.length) {
            if (typeof a[currentPos.a] === 'undefined') {
                tempArray.push(b[currentPos.b++]);
            } else if (a[currentPos.a].timestamp > b[currentPos.b].timestamp) {
                tempArray.push(a[currentPos.a++]);
            } else {
                tempArray.push(b[currentPos.b++]);
            }
        }

        while (currentPos.a < a.length) {
            tempArray.push(a[currentPos.a++]);
        }

        while (currentPos.b < b.length) {
            tempArray.push(b[currentPos.b++]);
        }
        return tempArray;
    }

    ngOnInit() {
    }

}
