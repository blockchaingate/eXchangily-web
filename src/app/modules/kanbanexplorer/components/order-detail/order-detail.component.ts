import { Component, OnInit } from '@angular/core';
import { Trade } from '../../models/trade';
import { KanbanService } from '../../services/kanban.service';
import BigNumber from 'bignumber.js';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrdeDetailComponent implements OnInit {
  orderHash = '';
  order: any;
  constructor(private route: ActivatedRoute, private kanbanService: KanbanService) {
  }

  ngOnInit() {
    this.orderHash = this.route.snapshot.paramMap.get('orderHash') || '';
      this.kanbanService.getOrder(this.orderHash).subscribe(
          (res: any) => {
            this.order = res;
          }
      );
  }
}
