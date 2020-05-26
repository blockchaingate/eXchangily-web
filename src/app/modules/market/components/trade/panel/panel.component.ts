import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';

import { Order } from '../../../models/order';

import { PriceService } from '../../../../../services/price.service';
import { KanbanService } from '../../../../../services/kanban.service';
import { CoinService } from '../../../../../services/coin.service';
import { OrderService } from '../../../services/order.service';
import { Wallet } from '../../../../../models/wallet';
import { WalletService } from '../../../../../services/wallet.service';
import { MyordersComponent } from '../myorder/myorders.component';
import { OrderPadComponent } from '../orderpad/order-pad.component';
import { Pair } from '../../../models/pair';

@Component({
    selector: 'app-trade-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit {
    @ViewChild('myOrders', {static: true}) myOrders: MyordersComponent;
    @ViewChild('orderPad', {static: true}) orderPad: OrderPadComponent;
    screenwidth: number;
    screenheight: number;
    orders: Order[];
    cat = 2;
    select = 2;
    pair = 'BTC/USDT';
    pairConfig: Pair = { name: 'BTCUSDT', priceDecimal: 2, qtyDecimal: 6 };
    searchText = '';
    baseCoin: number;
    targetCoin: number;
    mytokens: any;
    wallet: Wallet;
    address: string;
    errMsg = '';

    constructor(private prServ: PriceService, private _orderServ: OrderService, private _route: ActivatedRoute, 
        private _router: Router, private walletService: WalletService, private kanbanService: KanbanService
        , private coinService: CoinService) {
        setTheme('bs4'); // Bootstrap 4
    }

    onRefreshToken() {
        if (this.address) {
            this.kanbanService.getBalance(this.address).subscribe((resp) => {
                // console.log('resp from getBalances===');
                // console.log(resp);
                this.mytokens = resp;
            });
        }
    }

    async ngOnInit() {
        this.screenwidth = window.innerWidth;

        this.screenheight = window.innerHeight;  
        const wallet = await this.walletService.getCurrentWallet();
        if (wallet) {
            this.wallet = wallet;
            this.address = this.wallet.excoin.receiveAdds[0].address;
            this.onRefreshToken();
        } else {
            console.log('current wallet not found');
        }

        this.orders = this.getOrders();

        const inPair = this._route.snapshot.paramMap.get('pair');
        if (inPair) {
            const inPairArr = inPair.split('_');
            this.baseCoin = this.coinName2Number(inPairArr[0]);
            this.targetCoin = this.coinName2Number(inPairArr[1]);
            this.pair = inPair.replace('_', '/');
            this.setCurrentPair(inPairArr[0] + inPairArr[1]);
        }
    }

    setCurrentPair(pairName: string) {
        pairName = pairName.toLocaleUpperCase();
        let coinsConfig = sessionStorage.getItem('pairsConfig');
        if (!coinsConfig) {
          this.kanbanService.getPairConfig().subscribe(
            res => {
              coinsConfig = JSON.stringify(res);
              sessionStorage.setItem('pairsConfig', coinsConfig);
              const pairsCof = <Pair[]>res;
              this.pairConfig = pairsCof.find(item => item.name === pairName);
            },
            err => { this.errMsg = err.message; });
        } else {
          const pairsCof = <Pair[]>(JSON.parse(coinsConfig));
          this.pairConfig = pairsCof.find(item => item.name === pairName);
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
