import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';
import { UtilService } from '../../../../services/util.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-explorer-transaction-detail',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionDetailComponent implements OnInit {

    constructor(private kanbanServ: KanbanService, private utilServ: UtilService, 
        private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            'icon_copy',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/images/copy.svg')
          );      
    }    

    ngOnInit() {
    }

    copyAddress() {
        this.utilServ.copy('');
    }    
}
