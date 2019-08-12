import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Price } from '../../../../../interfaces/kanban.interface';
import { PriceService } from '../../../../../services/price.service';

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

    constructor(private prServ: PriceService, private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
        const inPair = this._route.snapshot.paramMap.get('pair');
        if (inPair) {
            this.pair = inPair.replace('_', '/');
        }
    }

    selectCat(cat: number) {
        this.prices = this.prServ.getPriceList();
    }

    loadTradePair(pair: string) {
        pair = pair.replace('/', '_');
        this._router.navigate(['market/trade/' + pair]);
   }

}
