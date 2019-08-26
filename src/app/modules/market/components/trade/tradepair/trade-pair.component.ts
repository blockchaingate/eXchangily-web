import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Order } from '../../../models/order';
import { OrderBookItem, TxRecord } from '../../../models/order-book';
import { OrderService } from '../../../services/order.service';

@Component({
    selector: 'app-trade-pair',
    templateUrl: './trade-pair.component.html',
    styleUrls: ['./trade-pair.component.css']
})

export class TradePairComponent implements OnInit {
    select = 1;
    myorder: Order;
    sells: OrderBookItem[] = [];
    buys: OrderBookItem[] = [];
    txOrders: TxRecord[] = [];
    currentPrice = 3788.8888;
    change24h = 1.35;
    totalBuy = 0.0;
    totalSell = 0.0;
    buyPrice = 0;
    buyQty = 0;
    sellPrice = 0;
    sellQty = 0;
    mytokens: any = [];

    constructor(private ordServ: OrderService, private _router: Router, 
        private activedRoute: ActivatedRoute) {
        console.log('constructor in TradePairComponent');
    }

    ngOnInit() {
        console.log('ngOnInit in TradePairComponent');
        this.activedRoute.params.subscribe(params => {
            let inPair = params['pair']; // (+) converts string 'id' to a number
            console.log('inPair===' + inPair);
            if (inPair) {
                inPair = inPair.replace('_', '/');
                this.sells = this.ordServ.getSellList(inPair);
                this.buys = this.ordServ.getBuyList(inPair);
                this.txOrders = this.ordServ.getTxRecords(inPair);                    
            }            
 
            // In a real app: dispatch action to load the details here.
        });        
 
    }

    selectOrder(ord: number) {
        this.select = ord;
    }

}
