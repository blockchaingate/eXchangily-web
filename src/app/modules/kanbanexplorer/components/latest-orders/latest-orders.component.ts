import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-latest-orders',
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.css']
})
export class LatestOrdersComponent implements OnInit {

  orders: Order[]
  displayedColumns = ['Pair', 'Price', 'Quantity', 'Block']
  interval;
  constructor(private kanbanService: KanbanService) {
    this.getLatestOrders()
    this.interval = setInterval(() => {
      this.getLatestOrders()
    }, 10000)
  }

  ngOnInit(): void {

  }

  getLatestOrders() {
    this.kanbanService.getLaetstOrders().subscribe(r => {
      this.orders = r
    })
  }
}
