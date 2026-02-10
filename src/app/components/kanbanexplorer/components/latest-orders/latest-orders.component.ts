import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-latest-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, RouterModule, TranslateModule],
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.css']
})
export class LatestOrdersComponent implements OnInit {

  orders: Order[] = [];
  displayedColumns = ['Pair', 'Price', 'Quantity', 'Block'];
  interval;
  constructor(private kanbanService: KanbanService) {
    this.getLatestOrders();
    this.interval = setInterval(() => {
      this.getLatestOrders();
    }, 10000);
  }

  ngOnInit(): void {
  }

  getLatestOrders() {
    this.kanbanService.getLaetstOrders().subscribe(r => {
      this.orders = r;
    });
  }
}
