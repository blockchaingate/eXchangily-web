import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
    selector: 'app-explorer-address-detail',
    templateUrl: './address-detail.component.html',
    styleUrls: ['./address-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddressDetailComponent implements OnInit {

    constructor(private kanbanServ: KanbanService) {
      
    }    

    async ngOnInit() {
    }    
    
}
