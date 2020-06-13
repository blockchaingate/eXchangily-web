import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price, Ticker } from '../../../../../interfaces/kanban.interface';
import { PriceService } from '../../../../../services/price.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { WsService } from '../../../../../services/ws.service';
import { UtilService } from '../../../../../services/util.service';
import BigNumber from 'bignumber.js';
import { Pair } from '../../../models/pair';

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
    selectedcat = 'USDT';
    selectedpair = 'BTC/USDT';
    pdecimal = '1.2-2';
    vdecimal = '1.6-6';
    // pairConfig: Pair = { name: 'BTCUSDT', priceDecimal: 2, qtyDecimal: 6 };
    errMsg = '';

    prices: Price[] = [];
    searchText = '';
    socket: WebSocketSubject<[Ticker]>;
    constructor(private prServ: PriceService,
        public utilServ: UtilService,
        private _route: ActivatedRoute,
        private _router: Router, private _wsServ: WsService) {
    }

    filterPrice(price: Price, selectedcat: string) {
        // console.log('this.select=', select);
        return price.symbol.indexOf(selectedcat) >= 0;
    }

    ngOnInit() {
        this.selectedcat = sessionStorage.getItem('tradeCat');
        if (!this.selectedcat) {
            this.selectedcat = 'USDT';
        }
        this.selectedpair = sessionStorage.getItem('tradePair');
        if (!this.selectedpair) {
            this.selectedpair = 'BTC/USDT';
        }

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
        if (this.searchText) {
            this.selectedpair = this.searchText.toUpperCase();
        }
    }

    selectCat(cat: string) {
        this.selectedcat = cat;
        sessionStorage.setItem('tradeCat', cat);
    }

    loadTradePair(pair: string) {
        this.selectedpair = pair;
        sessionStorage.setItem('tradePair', pair);
        pair = pair.replace('/', '_');
        /*
            this._router.navigateByUrl('/OrderPadComponent', { skipLocationChange: true }).then(() => {
                this._router.navigate(['market/trade/' + pair]);
            });
        */
        this._router.navigate(['market/trade/' + pair]);
    }

}
