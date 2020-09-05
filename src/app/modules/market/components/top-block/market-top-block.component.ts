import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../../../services/util.service';
import BigNumber from 'bignumber.js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-market-top-block',
  templateUrl: './market-top-block.component.html',
  styleUrls: ['./market-top-block.component.css']
})
export class MarketTopBlockComponent implements OnInit {
  @Input() pair: string;
  price: string;
  volume: string;
  changePercent: string;
  baseCoinName: string;
  targetCoinName: string;

  constructor(private utilServ: UtilService,private _router: Router) { }

  ngOnInit() {
    this.price = '0';
    this.volume = '0';
    this.changePercent = '0.00';
    const arr = this.pair.split('/');
    this.baseCoinName = arr[0];
    this.targetCoinName = arr[1];
  }

  toNumber(str: string) {
    return Number(str);
  }
  gotoTrade() {
    const pair = this.targetCoinName + '_' + this.baseCoinName;
    this._router.navigate(['market/trade/' + pair]);    
  }

  toDecimal(amount: number, decimal: number) {
    return amount.toFixed(decimal);
  }
  updateTicker(ticker) {
    console.log('updateTicker==', ticker);
    const price = this.toDecimal(ticker.p, 6);
    const volume = this.toDecimal(ticker.v, 6);
    this.price = price;
    this.volume = volume;

   this.changePercent = ((ticker.c - ticker.o) / ticker.o * 100).toFixed(2);
  }
}
