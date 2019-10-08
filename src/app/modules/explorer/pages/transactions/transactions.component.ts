import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
    selector: 'app-explorer-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionsComponent implements OnInit {
    @Input() notForGeneral: boolean;
    private _address = '';
    private _block = '';
    transactions: any;    
    total: number;
    pageNum: number;
    pageTotal: number;
    constructor(private kanbanServ: KanbanService) {
        this.total = 0;
        this.pageNum = 1;        
    }    

    @Input()
    set address(address: string) {
      this._address = (address && address.trim()) || '';
      if (this._address) {
        this.kanbanServ.getLatestTransactions('', this._address, 10).subscribe(
            (transactions: any) => {
                this.transactions = transactions.txs;
            }
        );          
      }
    }
  
    get address(): string { return this._address; }


    @Input()
    set block(block: string) {
      this._block = (block && block.trim()) || '';
      if (this._block) {
        this.kanbanServ.getLatestTransactions(this._block, '', 10).subscribe(
            (transactions: any) => {
                this.transactions = transactions.txs;
            }
        );          
      }
    }
  
    get block(): string { return this._block; }

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
        console.log('this.address=' + this.address);
        if (!this.notForGeneral) {
            this.kanbanServ.getLatestTransactions(this.block, this._address, 10).subscribe(
                (transactions: any) => {
                    this.transactions = transactions.txs;
                    this.total = transactions.total_txs;
                    this.pageTotal = Math.floor(this.total / 10) + 1;
                }
            ); 
        }
  
    }    
}
