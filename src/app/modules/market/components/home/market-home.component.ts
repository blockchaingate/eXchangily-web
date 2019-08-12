import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../../../services/kanban.service';

@Component({
  selector: 'app-market-home',
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.css']
})
export class MarketHomeComponent  implements OnInit {
  constructor(private kanbanService: KanbanService) {

  }
  ngOnInit() {
 
  }
}
