import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.css']
})

export class TradeComponent implements OnInit {
    errMsg = '';
    maintainence: boolean;
    constructor(private kanbanService: KanbanService) {}

    ngOnInit() {

        this.maintainence = false;

        this.kanbanService.getKanbanStatus().subscribe(
            (res: any) => {
                if(res && res.success) {
                    const data = res.body;
                    if(data != 'live') {
                        this.maintainence = true;
                    }
                }
            },
            err => { 
                if(environment.production) {
                    this.maintainence = true;
                }
            })
        ;
    }


    

}
