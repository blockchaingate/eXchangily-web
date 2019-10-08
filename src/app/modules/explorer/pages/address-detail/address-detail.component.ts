import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-explorer-address-detail',
    templateUrl: './address-detail.component.html',
    styleUrls: ['./address-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddressDetailComponent implements OnInit {
    address: string;
    constructor(private kanbanServ: KanbanService, private route: ActivatedRoute) {
      
    }    

    async ngOnInit() {
        this.address = this.route.snapshot.paramMap.get('id');
        console.log('this.address heee=' + this.address);
    }    
    
}
