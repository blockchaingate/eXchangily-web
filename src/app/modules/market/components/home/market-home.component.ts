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
  isMobile: boolean;
  constructor(private kanbanServ: KanbanService) { }

  ngOnInit() {
    this.maintainence = false;
    this.isMobile = true;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.isMobile = true;
    }

    this.kanbanServ.getKanbanStatus().subscribe(
      (res: any) => {
        if (res && res.success) {
          const data = res.body;
          if (data !== 'live') {
            this.maintainence = true;
          }
        }
      },
      err => {
        if (environment.production) {
          this.maintainence = true;
        }
      });
  }

  
}
