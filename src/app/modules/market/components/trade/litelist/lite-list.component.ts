import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price, Ticker } from '../../../../../interfaces/kanban.interface';
import { PriceService } from '../../../../../services/price.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

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
    prices: Price[] = [];
    searchText = '';
    socket: WebSocketSubject<[Ticker]>;
    constructor(private prServ: PriceService, private _route: ActivatedRoute, private _router: Router) {
    }

    filterPrice(price: Price, select: string) {
        // console.log('this.select=', select);
        return price.symbol.indexOf(select) >= 0;
    }
    ngOnInit() {
        this.prices = this.prServ.getPriceList();

        const streamName = '!ticker@arr';
        this.socket = new WebSocketSubject('wss://stream.binance.com:9443/ws/' + streamName);
        this.socket.subscribe(
          (tickers) => {
              for (let i = 0; i < tickers.length; i++) {
                const ticker = tickers[i];
                const symbol = ticker.s;
                const price = Number(ticker.c);
                const change24h = Number(ticker.P);
                const vol24h = Number(ticker.v);
                
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
