import { Component, OnInit } from '@angular/core';
import { Trade } from '../../models/trade';
import { KanbanService } from '../../services/kanban.service';
import BigNumber from 'bignumber.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-latest-trades',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, MatTableModule, TranslateModule],
  templateUrl: './latest-trades.component.html',
  styleUrls: ['./latest-trades.component.css']
})
export class LatestTradesComponent implements OnInit {

  trades: Trade[] = [];
  displayedColumns = ['Pair', 'Price', 'Quantity', 'Block'];
  interval: any;

  constructor(private kanbanService: KanbanService) {
    this.getLatestTrades();
    this.interval = setInterval(() => {
      this.getLatestTrades();
    }, 10000);
  }

  ngOnInit(): void {
  }

  getLatestTrades() {
    this.kanbanService.getLatestTrades().subscribe((r) => {
      this.trades = r;
      this.trades.forEach((trade) => {
        trade.price = (new BigNumber(trade.price).shiftedBy(-18)).toFixed(5);
        trade.amount = (new BigNumber(trade.amount).shiftedBy(-18)).toFixed(5);
      });
    });
  }
}
