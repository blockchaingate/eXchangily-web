import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-explorer-block-detail',
    templateUrl: './block-detail.component.html',
    styleUrls: ['./block-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BlockDetailComponent implements OnInit {
    block: any;
    id: number;
    constructor(private kanbanServ: KanbanService, private route: ActivatedRoute) {
    }    

    ngOnInit() {
        this.block = this.route.paramMap.subscribe(
            paramMap => {
                this.id = +paramMap.get('id');
                console.log('this.id = ' + this.id);
                this.kanbanServ.getBlock(this.id.toString()).subscribe(
                    (block) => {
                        console.log('block=', block);
                        this.block = block;

                    }
                );
            }
        );

    }
    goToPage(blockNum: number) {

    }    
}
