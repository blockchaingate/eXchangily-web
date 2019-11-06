import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price, Ticker } from '../../../../../interfaces/kanban.interface';
import { PriceService } from '../../../../../services/price.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { environment } from '../../../../../../environments/environment';
import { WsService } from '../../../services/ws.service';

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
    constructor(private prServ: PriceService, private _route: ActivatedRoute, private _router: Router, private _wsServ: WsService) {
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
                const price = Number(ticker.price) / 1e18;
                const open = Number(ticker['24h_open']) / 1e18;
                const close = Number(ticker['24h_close']) / 1e18;
                let change24h = 0;
                if (open > 0) {
                    change24h = (close - open) / open * 100;
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
