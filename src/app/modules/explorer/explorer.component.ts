import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ExplorerComponent implements OnInit {
    latestBlock: any;
    latestBlockNumber: number;
    difficulty: string;
    timeOfLastBlock: number;
    totalAddress: string;

    blocks: any;

    transactions: any;    

    constructor(private kanbanServ: KanbanService, private router: Router) {
        
    }    

    ngOnInit() {
        this.kanbanServ.getLatestTransactions(null, null, 5).subscribe(
            (transactions: any) => {
                this.transactions = transactions.txs;
            }
        );
        
        this.kanbanServ.getLatestBlocks().subscribe(
            (blocks: any) => {
                this.blocks = blocks;
                if (this.blocks && this.blocks.length > 0) {
                    this.latestBlock = this.blocks[0];
                    this.difficulty = this.latestBlock.totalDifficulty;
                    this.latestBlockNumber = this.latestBlock.number;
                    this.timeOfLastBlock = this.latestBlock.timestamp;
                }
            }
        );

        this.kanbanServ.getAccounts().subscribe(
            (res: any) => {
                console.log('res in getAccounts=', res);
                this.totalAddress = res.accounts.length.toString();
            }
        );
        // this.totalAddress = accounts.length.toString();
        
    }

    search (searchText: string) {
        console.log('searchText=' + searchText);
        if (searchText.match(/^\d+$/)) {
            this.router.navigate(['/explorer/block/' + searchText]);
        }
    }
}
