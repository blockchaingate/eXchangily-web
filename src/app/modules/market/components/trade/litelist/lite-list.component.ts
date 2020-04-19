import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price, Ticker } from '../../../../../interfaces/kanban.interface';
import { PriceService } from '../../../../../services/price.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { WsService } from '../../../../../services/ws.service';
import { UtilService } from '../../../../../services/util.service';
import BigNumber from 'bignumber.js';

export interface Section {
    name: string;
    updated: Date;
  }
@Component({
    selector: 'app-lite-list',
    templateUrl: './lite-list.component.html',
    styleUrls: ['./lite-list.component.css']
})

export class LiteListComponent implements OnInit {
    select = 'USDT';
    pair = 'BTC/USDT';
    pdecimal = '1.2-2';
    vdecimal = '1.6-6';

    prices: Price[] = [];
    searchText = '';
    socket: WebSocketSubject<[Ticker]>;
    constructor(private prServ: PriceService, 
        public utilServ: UtilService,
        private _route: ActivatedRoute, 
        private _router: Router, private _wsServ: WsService) {
    }

    filterPrice(price: Price, select: string) {
        // console.log('this.select=', select);
        return price.symbol.indexOf(select) >= 0;
    }
    ngOnInit() {
        this.prices = this.prServ.getPriceList();
        // this._wsServ.getAllPrices();
        // this.socket = new WebSocketSubject(environment.websockets.allprices);
        this._wsServ.currentPrices.subscribe(
          (tickers: any) => {
              // console.log('tickets=', tickers);
              for (let i = 0; i < tickers.length; i++) {
                const ticker = tickers[i];
                const symbol = ticker.symbol;
                const price = Number(ticker.price);
                const open = Number(ticker['24h_open']);
                const close = Number(ticker['24h_close']);
                let change24h = 0;

                const bigO = new BigNumber(ticker['24h_open']);
                const bigC = new BigNumber(ticker['24h_close']);                
                if (bigO.gt(0)) {
                    // change24h = (close - open) / open * 100;
                    // change24h = Math.floor(change24h * 100) / 100;

                    const change24hBig = bigC.minus(bigO).dividedBy(bigO).multipliedBy(new BigNumber(100));
                    change24h = change24hBig.toNumber();
                    change24h = Math.floor(change24h * 100) / 100;                    
                }
                const vol24h = Number(ticker['24h_volume']);
                
                for (let j = 0; j < this.prices.length; j++) {
                    const symbol_replace = this.prices[j].symbol.replace('/', '');
                    if (symbol === symbol_replace) {
                        this.prices[j].price = price;
                        this.prices[j].change24h = change24h;
                        this.prices[j].vol24h = vol24h;
                    }
                }           
              }
          }
        );    
    }
    setSelect() {
        this.select = this.searchText;
    }
    selectCat(cat: string) {
        this.select = '/' + cat;
        
    }

    loadTradePair(pair: string) {
        console.log('pair for loadTradePair:' + pair);
        pair = pair.replace('/', '_');
        this._router.navigate(['market/trade/' + pair]);
    }

}
