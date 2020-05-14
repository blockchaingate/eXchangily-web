import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-explorer-block-detail',
    templateUrl: './block-detail.component.html',
    styleUrls: ['./block-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BlockDetailComponent implements OnInit {
    block: any;
    id: string;
    constructor(private kanbanServ: KanbanService, private route: ActivatedRoute, private router: Router) {
    }    

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');

        this.kanbanServ.getBlock(this.id).subscribe(
            (block: any) => {
                this.block = block.block;
            }
        );

    }

    goToPreviousBlock() {
        const blockNum = this.block.number - 1;
        this.kanbanServ.getBlock(blockNum.toString()).subscribe(
            (block: any) => {
                this.block = block.block;
            }
        );
    }    

    goToNextBlock() {
        const blockNum = this.block.number + 1;
        this.kanbanServ.getBlock(blockNum.toString()).subscribe(
            (block: any) => {
                this.block = block.block;
            }
        );
    }        
}
