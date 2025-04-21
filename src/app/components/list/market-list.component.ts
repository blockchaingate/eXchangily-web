import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PriceService } from '../../services/price.service';
import { KanbanService } from '../../services/kanban.service';
import { WsService } from '../../services/ws.service';
import { StorageService } from '../../services/storage.service';
import { Order, Price, Coin } from '../../models/kanban.interface';
import { UtilService } from '../../services/util.service';
import BigNumber from 'bignumber.js';
import { CoinService } from '../../services/coin.service';
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

    sortField = '';
    sortFieldType = '';
    sortAsc = false;
    sortAscPair = 0;
    sortAscPrice = 0;
    sortAscChange = 0;
    sortAscHigh = 0;
    sortAscLow = 0;
    sortAscVolume = 0;

    constructor(
        private coinServ: CoinService,
        private prServ: PriceService, private _router: Router, private storageServ: StorageService,
        private _wsServ: WsService, private kanbanService: KanbanService, public utilServ: UtilService) {
    }

    showAmount(amount: number, decimal: number) {
        return this.utilServ.showAmount(amount, decimal);
    }

    changeSort(field: string, fieldType: string) {
        this.sortField = field;
        this.sortFieldType = fieldType;
        if (field == 'coin_id') {
            if (!this.sortAscPair) {
                this.sortAscPair = 1;
            } else {
                this.sortAscPair = -this.sortAscPair;
            }
            if (this.sortAscPair == 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field == 'price') {
            if (!this.sortAscPrice) {
                this.sortAscPrice = 1;
            } else {
                this.sortAscPrice = -this.sortAscPrice;
            }
            if (this.sortAscPrice == 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field == 'change24h') {
            if (!this.sortAscChange) {
                this.sortAscChange = 1;
            } else {
                this.sortAscChange = -this.sortAscChange;
            }
            if (this.sortAscChange == 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field == 'price24hh') {
            if (!this.sortAscHigh) {
                this.sortAscHigh = 1;
            } else {
                this.sortAscHigh = -this.sortAscHigh;
            }
            if (this.sortAscHigh == 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field == 'price24hl') {
            if (!this.sortAscLow) {
                this.sortAscLow = 1;
            } else {
                this.sortAscLow = -this.sortAscLow;
            }
            if (this.sortAscLow == 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field == 'vol24h') {
            if (!this.sortAscVolume) {
                this.sortAscVolume = 1;
            } else {
                this.sortAscVolume = -this.sortAscVolume;
            }
            if (this.sortAscVolume == 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        }

    }

    ngOnInit() {
        this.sortField = '';
        this.sortFieldType = '';
        this.sortAsc = true;
        this.sortAscPair = 0;
        this.sortAscPrice = 0;
        this.sortAscChange = 0;
        this.sortAscHigh = 0;
        this.sortAscLow = 0;
        this.sortAscVolume = 0;

        this.prServ.getPriceList(100, 0).subscribe(
            (ret: any) => {
                console.log('ret===', ret);
                if (ret && ret.success) {
                    const data = ret.data;
                    console.log('dataaaaa===', data);
                    this.prices = data;
                    this.selectCat('DUSD');
                }
            }
        );

        this.storageServ.getFavoritePairs().subscribe(
            (pairs: any) => {
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
        this.select = catName;
        console.log('catName===', catName);
        if (catName == '100') {
            this.tab_prices = this.prices.filter((listing: Price) => this.favorite_pairs.indexOf(listing.symbol) >= 0);
        } else if (catName == '1000') {
            this.tab_prices = [];
        } else {
            this.tab_prices = this.prices.filter((listing: Price) => listing.symbol.indexOf('kb' + catName) >= 0);
        }
    }

    search() {
        const searchText = this.searchText.toUpperCase();
        this.selectCat('1000');
        this.tab_prices = this.prices.filter((listing: Price) => listing.symbol.indexOf(searchText) >= 0);
    }

    gotoTrade(pr: any) {
        console.log('pr trade=', pr);
        this._router.navigate(['market/trade/' + pr.symbol]);
        /*
        const pair = this.getCoinName(this.prices[id].coin_id) + '_' + this.getCoinName(this.prices[id].base_id);
        this._router.navigate(['market/trade/' + pair]);
        */
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
        if (amount) {
            return amount.toFixed(decimal);
        }
        return 0;
    }

    getCoinName(coin_id: number) {
        return this.coinServ.getCoinNameByTypeId(coin_id);
    }
    updateTickerList(arr: Array<any>) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const s = item.s;
            const h = item['h'];
            const price = item.c;
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
                const tabItemSymbol = tabItem.symbol;
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
