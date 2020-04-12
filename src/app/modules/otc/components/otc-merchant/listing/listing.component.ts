import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-otc-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
    bidOrAsk: boolean;
    coinName: string;
    currency: string;
    advType: string;
    dataSource = [];
    currencies: string[] = [
        'USD',
        'CAD',
        'CNY'
    ];

    constructor() {}

    ngOnInit() {
        this.bidOrAsk = true;
        this.coinName = 'USDT';
        this.currency = 'USD';
        this.advType = 'ongoing';
    }

    changeAdvType(type: string) {
        this.advType = type;
    }

    changeCoinName(bOrA: boolean, coin: string) {
        this.bidOrAsk = bOrA;
        this.coinName = coin;
        // console.log('this.coinName = ', this.coinName);
    }
}
