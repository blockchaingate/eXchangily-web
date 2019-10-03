import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
    selector: 'app-explorer-transaction-detail',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionDetailComponent implements OnInit {

    constructor(private kanbanServ: KanbanService) {
      
    }    

    async ngOnInit() {
    }    
    
}
