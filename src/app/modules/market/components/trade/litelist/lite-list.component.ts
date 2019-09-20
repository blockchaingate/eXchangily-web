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
        //console.log('this.select=', select);
        return price.symbol.indexOf(select) >= 0;
    }
    ngOnInit() {
        this.selectCat('USDT');
        const streamName = '!ticker@arr';
        this.socket = new WebSocketSubject('wss://stream.binance.com:9443/ws/' + streamName);
        this.socket.subscribe(
          (tickers) => {
              this.prices = [];
              for (let i = 0; i < tickers.length; i++) {
                const ticker = tickers[i];
                const price = {
                    id: 0,
                    base_id: 0,
                    coin_id: 0,
                    favorite: 1,
                    price24hh: 0,
                    price24hl: 0,
                    symbol: ticker.s,
                    price: Number(ticker.c),
                    change24h: Number(ticker.P),
                    vol24h: Number(ticker.v)
                };   
                this.prices.push(price);              
              }
              //this.socket.unsubscribe();
          }
        );        
    }
    setSelect() {
        this.select = this.searchText;
    }
    selectCat(cat: string) {
        this.select = cat;
        this.prices = this.prServ.getPriceList();
    }

    loadTradePair(pair: string) {
        
        pair = pair.replace('/', '_');
        this._router.navigate(['market/trade/' + pair]);
    }

}
