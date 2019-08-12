import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PriceService } from '../../../../services/price.service';
import { KanbanService } from '../../../../services/kanban.service';

import { Order, Price, Coin } from '../../../../interfaces/kanban.interface';

@Component({
    selector: 'app-market-list',
    templateUrl: './market-list.component.html',
    styleUrls: ['./market-list.component.css']
})

export class MarketListComponent implements OnInit {
    select = 0;
    prices: Price[] = [];
    tab_prices: Price[] = [];
    searchText = '';
    COINS: Coin[];
    constructor(private prServ: PriceService, private _router: Router, private kanbanService: KanbanService) {
        
    }

    ngOnInit() {
        this.prices = this.prServ.getPriceList();
        this.COINS = this.prServ.getCoinList();
        this.selectCat(100);
        if (!this.tab_prices || this.tab_prices.length === 0) {
            this.selectCat(0);
        }
        
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
    }
        
    selectCat(cat: number) {
        this.select = cat;
        if (cat === 100) {
            this.tab_prices = this.prices.filter((listing: Price) => listing.favorite === 1);
        } else {
            this.tab_prices = this.prices.filter((listing: Price) => listing.base_id === cat);
        }
        
    }
        
    gotoTrade(id: number) {
        const pair = this.COINS[this.prices[id].coin_id].name + '_' + this.COINS[this.prices[id].base_id].name;
        this._router.navigate(['market/trade/' + pair]);
    }

    toggleFavorite(price: Price) {
        price.favorite = 1 - price.favorite;
    }
}
