import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
  selector: 'app-market-home',
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.scss']
})
export class MarketHomeComponent implements OnInit {
  maintainence: boolean;

  constructor(private kanbanServ: KanbanService) {}
  
  ngOnInit() {
    this.maintainence = false;
    this.kanbanServ.getKanbanStatus().subscribe(
        (res: any) => {
            if(res && res.success) {
                const data = res.body;
                if(data == 'maint') {
                    this.maintainence = true;
                }
            }
        },
        err => { console.log(err); });
    ;
  }
}
