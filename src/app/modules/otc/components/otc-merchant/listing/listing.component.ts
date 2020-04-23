import { Component, OnInit } from '@angular/core';
import { appId } from '../../../../landing/app.constants';
import { StorageService } from '../../../../../services/storage.service';
import { OtcService } from '../../../../../services/otc.service';

@Component({
    selector: 'app-otc-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
    maxLimit: number;
    buy: boolean;
    coin: string;
    fiat: string;
    advType: string;
    price: number;
    listings: any;
    
    quantity: number;
    qtyLimitPerOrderLow: number;
    qtyLimitPerOrderHigh: number;
    notes: string;
    token: string;
    paymethods = ['E-Transfer'];
    fiats: string[] = [
        'USD',
        'CAD',
        'CNY'
    ];

    constructor(
        private storageService: StorageService,
        private _otcServ: OtcService) { }

    ngOnInit() {
        this.buy = true;
        this.coin = 'USDT';
        this.fiat = 'USD';
        this.advType = 'ongoing';

        this.storageService.getToken().subscribe(
            (token: string) => {
                this.token = token;
                this._otcServ.getListings(this.token).subscribe(
                    (res: any) => {
                        if(res && res.ok) {
                            this.listings = res._body;
                        }
                    }
                );
            }
        );
    }

    addListing() {
        const data = {
            appId: appId,
            coin: this.coin,
            fiat: this.fiat,
            buy: this.buy,
            qtyAvilable: this.quantity,
            qtyLimitPerOrderLow: this.qtyLimitPerOrderLow,
            qtyLimitPerOrderHigh: this.qtyLimitPerOrderHigh,
            price: this.price,
            notes: this.notes,
            paymethods: this.paymethods
        };
        this._otcServ.addListing(this.token, data).subscribe(
            (res: any) => {
                console.log('res from addListing=', res);
                if(res.ok) {
                    this.listings.push(res._body);
                }
            }
        );

    }

    /*
        merchantId: ObjectId,
        sequence: Number,
        coin: String,
        fiat: String,
        buy: Boolean,
        qtyAvilable: Number,
        qtyLimitPerOrderLow: Number,
        qtyLimitPerOrderHigh: Number,
        price: Number,
        paymethods: [String],
    
        notes: String,
        active: Boolean,
        lastUpdated: Date,
    */
    changeAdvType(type: string) {
        this.advType = type;
    }

    changeCoin(bOrA: boolean, coin: string) {
        this.buy = bOrA;
        this.coin = coin;
    }

    getCoinAvailable(coin: string) {

    }
}
