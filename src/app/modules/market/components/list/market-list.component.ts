import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PriceService } from '../../../../services/price.service';
import { KanbanService } from '../../../../services/kanban.service';
import { WsService } from '../../../../services/ws.service';
import { StorageService } from '../../../../services/storage.service';
import { Order, Price, Coin } from '../../../../interfaces/kanban.interface';
import { UtilService } from '../../../../services/util.service';
import BigNumber from 'bignumber.js';
import { CoinService } from 'src/app/services/coin.service';
import { stringify } from 'querystring';

@Component({
    selector: 'app-market-list',
    templateUrl: './market-list.component.html',
    styleUrls: ['./market-list.component.scss']
})

export class MarketListComponent implements OnInit {
    select = '';
    prices: Price[] = [];
    tab_prices: Price[] = [];
    favorite_pairs: string[] = [];
    searchText = '';
    COINS: Coin[];

    constructor(
        private coinServ: CoinService,
        private prServ: PriceService, private _router: Router, private storageServ: StorageService,
        private _wsServ: WsService, private kanbanService: KanbanService, public utilServ: UtilService) {
    }

    showAmount(amount: number, decimal: number) {
        return this.utilServ.showAmount(amount, decimal);
    }

    ngOnInit() {
        this.prices = this.prServ.getPriceList();

        console.log('this.prices=', this.prices);
        this.COINS = this.prServ.getCoinList();
        this.selectCat('USDT');
        this.storageServ.getFavoritePairs().subscribe(
            (pairs: string[]) => {
                if (pairs && pairs.length > 0) {
                    this.favorite_pairs = pairs;
                    this.selectCat('100');
                }
            }
        );

        this._wsServ.currentPrices.subscribe((arr: any) => {
            this.updateTickerList(arr);
        });

        /*
        this.kanbanService.getAllOrders().subscribe((orders: Order[]) => {
            console.log('orders from /exchangily/getAllOrderData');
            console.log(orders);
            for (let i = 0 ; i < orders.length; i++) {
                const order = orders[i];
                for (let j = 0; j < this.prices.length; j++) {
                    const price = this.prices[j];
                    if (price.base_id === order.baseCoin && price.coin_id === order.targetCoin) {
                        price.price = order.price;
                        price.vol24h = order.amount;
                    }
                }
            }

        });  
        */
    }

    selectCat(catName: string) {
        console.log('this.prices=', this.prices);
        console.log('catName=', catName);
        this.select = catName;
        if (catName == '100') {
            this.tab_prices = this.prices.filter((listing: Price) => this.favorite_pairs.indexOf(listing.symbol) >= 0);
        } else if (catName == '1000') {
            this.tab_prices = [];
        } else {
            this.tab_prices = this.prices.filter((listing: Price) => listing.symbol.indexOf('/' + catName) >= 0);
        }
        console.log('this.tab_prices=', this.tab_prices);
    }

    search() {
        const searchText = this.searchText.toUpperCase();
        this.selectCat('1000');
        this.tab_prices = this.prices.filter((listing: Price) => listing.symbol.indexOf(searchText) >= 0);
    }

    gotoTrade(id: number) {
        const pair = this.COINS[this.prices[id].coin_id].name + '_' + this.COINS[this.prices[id].base_id].name;
        this._router.navigate(['market/trade/' + pair]);
    }

    isFavorite(price: Price) {
        return this.favorite_pairs.includes(price.symbol);
    }

    toggleFavorite(price: Price) {
        const symbol = price.symbol;
        if (this.favorite_pairs.includes(symbol)) {
            this.favorite_pairs = this.favorite_pairs.filter(
                (item) => (item !== symbol)
            );
        } else {
            this.favorite_pairs.push(symbol);
        }
        console.log('this.favorite_pairs=', this.favorite_pairs);
        this.storageServ.storeFavoritePairs(this.favorite_pairs);
    }

    toDecimal(amount: number, decimal: number) {
        return amount.toFixed(decimal);
    }
    
    getCoinName(coin_id: number) {
        return this.coinServ.getCoinNameByTypeId(coin_id);
    }
    updateTickerList(arr) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const s = item.s;
            const h = item['h'];
            const price = item.p;
            const l = item['l'];
            let change24h = 0;
            const o = item['o'];
            const c = item['c'];
            //const bigO = new BigNumber(o);
            //const bigC = new BigNumber(c);
            /*
            if (bigO.gt(0)) {
                const change24hBig = bigC.minus(bigO).dividedBy(bigO).multipliedBy(new BigNumber(100));
                change24h = change24hBig.toNumber();
                change24h = Math.floor(change24h * 100) / 100;
            }
            */
            if (o > 0) {
                change24h = Number(((c - o) / o * 100).toFixed(2));
            }
            const v = item['v'];
            for (let j = 0; j < this.tab_prices.length; j++) {
                const tabItem = this.tab_prices[j];
                const tabItemSymbol = this.getCoinName(tabItem.coin_id) + this.getCoinName(tabItem.base_id);
                if (s == tabItemSymbol) {
                    tabItem.change24h = change24h;
                    tabItem.price = price;
                    tabItem.price24hh = h;
                    tabItem.price24hl = l;
                    tabItem.vol24h = v;
                }
            }
        }
    }
}
