import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Price, Ticker } from '../../../../../interfaces/kanban.interface';
import { PriceService } from '../../../../../services/price.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Component({
    selector: 'app-lite-list',
    templateUrl: './lite-list.component.html',
    styleUrls: ['./lite-list.component.css']
})

export class LiteListComponent implements OnInit {
    select = 1;
    pair = 'BTC/USDT';
    prices: Price[] = [];
    searchText = '';
    socket: WebSocketSubject<[Ticker]>;

    constructor(private prServ: PriceService, private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
        this.selectCat(1);
        const streamName = '!ticker@arr';
        this.socket = new WebSocketSubject('wss://stream.binance.com:9443/ws/' + streamName);
        this.socket.subscribe(
          (tickers) => {
              this.prices = [];
              for (let i = 0; i < 25; i++) {
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
          }
        );        
    }

    selectCat(cat: number) {
        this.select = cat;
        this.prices = this.prServ.getPriceList();
    }



}
