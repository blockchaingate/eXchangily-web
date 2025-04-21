import { Component, TemplateRef, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';
import * as exaddr from '../../../../lib/exaddr';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    fabAddress = '';
    transactionHistories: any;
    constructor(private kanbanServ: KanbanService) {
    }

    ngOnInit() {
    }

    search() {
        let fabAddress = this.fabAddress;
        try {
            const fabaddr = exaddr.toLegacyAddress(fabAddress);
            if (fabaddr) {
                fabAddress = fabaddr;
            }
        } catch (e) {

        }
        this.kanbanServ.getTransactionHistoryOnProduction(fabAddress).subscribe(
            (res: any) => {
                console.log('resss=', res);
                if (res && res.success) {
                    this.transactionHistories = res.data.reverse();
                }
            }
        );
    }
}