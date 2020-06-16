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
        this.setPairs();
        this.maintainence = environment.maintainence;
    }

    setPairs() {
        let pairsConfig = sessionStorage.getItem('pairsConfig');
        if (!pairsConfig) {
            this.kanbanService.getPairConfig().subscribe(
                res => {
                    pairsConfig = JSON.stringify(res);
                    sessionStorage.setItem('pairsConfig', pairsConfig);
                },
                err => { this.errMsg = err.message; });
        }
    }

}
