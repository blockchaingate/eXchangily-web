import { Component, OnInit, Input } from '@angular/core';

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
  
  constructor() { }

  ngOnInit() {
    this.price = 0;
    this.volume = 0;
    this.changePercent = 0.00;
    const arr = this.pair.split('/');
    this.baseCoinName = arr[0];
  }

  updateTicker (ticker) {
    const c = ticker.c;
    const v = ticker.v;
    const P = ticker.P;
    this.price = c;
    this.volume = v;
    this.changePercent = P;
  }
}
