import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketTopBlockComponent } from '../top-block/market-top-block.component';
import { WsService } from '../../../../services/ws.service';

@Component({
  selector: 'app-market-top',
  templateUrl: './market-top.component.html',
  styleUrls: ['./market-top.component.scss']
})
export class MarketTopComponent implements OnInit {

  @ViewChild('marketTopBlock1', { static: true }) marketTopBlock1: MarketTopBlockComponent;
  @ViewChild('marketTopBlock2', { static: true }) marketTopBlock2: MarketTopBlockComponent;
  @ViewChild('marketTopBlock3', { static: true }) marketTopBlock3: MarketTopBlockComponent;
  @ViewChild('marketTopBlock4', { static: true }) marketTopBlock4: MarketTopBlockComponent;

  constructor(private _wsServ: WsService) { }

  ngOnInit() {
    this._wsServ.currentPrices.subscribe((arr: any) => {
      this.updateTickerList(arr);
    });
  }

  updateTickerList(arr) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      const s = item.s;
      if (s === 'BTCUSDT') {
        this.marketTopBlock1.updateTicker(item);
      } else if (s === 'FABUSDT') {
        this.marketTopBlock2.updateTicker(item);
      } else if (s === 'ETHUSDT') {
        this.marketTopBlock3.updateTicker(item);
      } else if (s === 'EXGUSDT') {
        this.marketTopBlock4.updateTicker(item);
      }
    }
  }
}
