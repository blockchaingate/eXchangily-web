import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
    selector: 'app-explorer-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionsComponent implements OnInit {
    transactions: any;    
    total: number;
    pageNum: number;
    pageTotal: number;
    constructor(private kanbanServ: KanbanService) {
        this.total = 0;
        this.pageNum = 1;        
    }    

    async goToPage(page: number) {
        if (page < 1) {
            page = 1;
        } else 
        if ( page > this.pageTotal ) {
            page = this.pageTotal;
        }
        this.pageNum = page;
        const blockNum = this.total - (this.pageNum - 1) * 10;
        let count = 10;
        if (blockNum < count) {
            count = blockNum;
        }
        this.kanbanServ.getTransactions(blockNum, count).subscribe(
            (transactions: any) => {
                this.transactions = transactions.txs;
            }
        );
        
    }

    ngOnInit() {
        this.kanbanServ.getLatestTransactions(10).subscribe(
            (transactions: any) => {
                this.transactions = transactions.txs;
                this.total = transactions.total_txs;
                this.pageTotal = Math.floor(this.total / 10) + 1;
            }
        );

    }    
}
