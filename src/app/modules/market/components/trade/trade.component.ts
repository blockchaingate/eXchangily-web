import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';

import { Order } from '../../models/order';

import { PriceService } from '../../../../services/price.service';
import { KanbanService } from '../../../../services/kanban.service';
import { CoinService } from '../../../../services/coin.service';
import { OrderService } from '../../services/order.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';
import { ConditionalExpr, ElementSchemaRegistry } from '@angular/compiler';
import { Wallet } from '../../../../models/wallet';
import { WalletService } from '../../../../services/wallet.service';
import { MyordersComponent } from './myorder/myorders.component';
import { OrderPadComponent } from './orderpad/order-pad.component';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.css']
})

export class TradeComponent implements OnInit {
    @ViewChild('myOrders', {static: true}) myOrders: MyordersComponent;
    @ViewChild('orderPad', {static: true}) orderPad: OrderPadComponent;
    screenwidth: number;
    screenheight: number;
    orders: Order[];
    cat = 2;
    select = 2;
    pair = 'BTC/USDT';
    searchText = '';
    baseCoin: number;
    targetCoin: number;
    mytokens: any;
    wallet: Wallet;
    address: string;
    constructor(private prServ: PriceService, private _orderServ: OrderService, private _route: ActivatedRoute, 
        private _router: Router, private walletService: WalletService, private kanbanService: KanbanService
        , private coinService: CoinService) {
        setTheme('bs4'); // Bootstrap 4
    }

    onRefreshToken() {
        console.log('onRefreshToken');
        if (this.address) {
            this.kanbanService.getBalance(this.address).subscribe((resp) => {
                console.log('resp from getBalances===');
                console.log(resp);
                this.mytokens = resp;
                if (this.myOrders) {
                    this.myOrders.onRefreshToken(resp);
                }
                if (this.orderPad) {
                    this.orderPad.onRefreshToken(resp);
                }
                
            });
        }    
    }

    async ngOnInit() {
        this.screenwidth = window.innerWidth;
        this.screenheight = window.innerHeight;        
        //console.log('width=', width);
        const wallet = await this.walletService.getCurrentWallet();
        if (wallet) {
            this.wallet = wallet;
            this.address = this.wallet.excoin.receiveAdds[0].address;
            console.log('address here we go=' + this.address);
            this.onRefreshToken();
        }

        /*
        this.walletService.getCurrentWallets().subscribe((wallets: Wallet[]) => {
            if (wallets && wallets.length > 0) {
              this.wallet = wallets[0];
              if (this.wallet && this.wallet.excoin && this.wallet.excoin.receiveAdds) {
                console.log(this.wallet);
                this.address = this.wallet.excoin.receiveAdds[0].address;
                console.log('address here we go=' + this.address);
                if (this.address) {
                    this.kanbanService.getBalance(this.address).subscribe((resp) => {
                        console.log('resp from getBalances===');
                        console.log(resp);
                        this.mytokens = resp;
                    });
                }                 
              }
            }
        });
        */
        //  const Pair = <Price>JSON.parse(pair);
        // alert(Pair.coin);

        this.orders = this.getOrders();

        const inPair = this._route.snapshot.paramMap.get('pair');
        if (inPair) {
            console.log('this.iiipair=' + inPair);
            const inPairArr = inPair.split('_');
            this.baseCoin = this.coinName2Number(inPairArr[0]);
            this.targetCoin = this.coinName2Number(inPairArr[1]);
            this.pair = inPair.replace('_', '/');

        }
        
    }

    coinName2Number(name: string) {
        return this.coinService.getCoinTypeIdByName(name);
    }

    selectOrder(selected: number) {
        alert(selected);
    }

    getOrders() {
        return this._orderServ.getOrders();
    }
}
