import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../../../services/util.service';

@Component({
  selector: 'app-market-top-block',
  templateUrl: './market-top-block.component.html',
  styleUrls: ['./market-top-block.component.css']
})
export class MarketTopBlockComponent implements OnInit {
  @Input() pair: string;
  price: number;
  volume: number;
  changePercent: number;
  baseCoinName: string;
  
  constructor(private utilServ: UtilService) { }

  ngOnInit() {
    this.price = 0;
    this.volume = 0;
    this.changePercent = 0.00;
    const arr = this.pair.split('/');
    this.baseCoinName = arr[0];
  }

  updateTicker (ticker) {
    const price = this.utilServ.showAmount(ticker.price);
    const volume = this.utilServ.showAmount(ticker['24h_volume']);
    const open = this.utilServ.showAmount(ticker['24h_open']);
    const close = this.utilServ.showAmount(ticker['24h_close']);
    this.price = price;
    this.volume = volume;
    this.changePercent = 0;
    if (open !== 0) {
      this.changePercent = (close - open) / open * 100;
    }
  }
}
