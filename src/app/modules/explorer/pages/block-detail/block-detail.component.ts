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
      this.id = 1;
    }    

    ngOnInit() {
        this.block = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
              this.kanbanServ.getBlock(params.get('id')))
        );
    }    
}
