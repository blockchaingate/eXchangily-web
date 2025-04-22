import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { KanbanStatsComponent } from '../kanban-stats/kanban-stats.component';
import { LatestOrdersComponent } from '../latest-orders/latest-orders.component';
import { LatestTradesComponent } from '../latest-trades/latest-trades.component';
import { BlocksComponent } from '../blocks/blocks.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SearchBoxComponent, KanbanStatsComponent, LatestOrdersComponent,LatestTradesComponent, BlocksComponent ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
