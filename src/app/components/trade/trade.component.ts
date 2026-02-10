import { Component, OnInit } from '@angular/core';
import { KanbanV2Service } from '../../services/kanban-v2.service';
import { CommonModule } from '@angular/common';
import { LiteListComponent } from './litelist/lite-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-trade',
    standalone: true,
    imports: [CommonModule, LiteListComponent, RouterOutlet],
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.css']
})

export class TradeComponent implements OnInit {
    errMsg = '';
    maintainence = false;

    constructor(private kanbanService: KanbanV2Service) {}

    ngOnInit() {
        this.maintainence = false;
        /*
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
        */
    }
}
