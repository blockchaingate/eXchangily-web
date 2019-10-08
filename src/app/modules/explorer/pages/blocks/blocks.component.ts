import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
    selector: 'app-explorer-blocks',
    templateUrl: './blocks.component.html',
    styleUrls: ['./blocks.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BlocksComponent implements OnInit {
    blocks: any;
    total: number;
    pageNum: number;
    pageTotal: number;
    constructor(private kanbanServ: KanbanService) {
        this.total = 0;
        this.pageNum = 1;
    }    

    goToPage (page: number) {
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
        this.kanbanServ.getBlocks(blockNum, count).subscribe(
            (blocks: any) => {
                this.blocks = blocks;
            }
        );

    }
    ngOnInit() {
        this.kanbanServ.getLatestBlocks().subscribe(
            (blocks: any) => {
                this.blocks = blocks;
                if (this.blocks) {
                    this.total = this.blocks[0].number;
                    this.pageTotal = Math.floor(this.total / 10) + 1;
                }
            }
        );

        
    }    
}
