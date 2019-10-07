import { Component, Output, TemplateRef, Input, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//import { Order } from '../../../models/order';
import { Order, OrderBookItem, OrderItem, TradeItem } from '../../../../../interfaces/kanban.interface';
import { TxRecord } from '../../../models/order-book';
import { OrderService } from '../../../services/order.service';
import { Web3Service } from '../../../../../services/web3.service';
import { KanbanService } from '../../../../../services/kanban.service';
import { TradeService } from '../../../services/trade.service';

import { UtilService } from '../../../../../services/util.service';
import { WalletService } from '../../../../../services/wallet.service';
import { CoinService } from '../../../../../services/coin.service';
import { Wallet } from '../../../../../models/wallet';
import * as secureRandom from 'secure-random';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TransactionResp} from '../../../../../interfaces/kanban.interface';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { ActivatedRoute } from '@angular/router';

declare let window: any;
@Component({
    selector: 'app-order-pad',
    templateUrl: './order-pad.component.html',
    styleUrls: ['./order-pad.component.css']
})

export class OrderPadComponent implements OnInit, OnDestroy {

    @Input() wallet: Wallet;
    private _mytokens: any;
    @Output() refreshToken = new EventEmitter();

    screenheight = screen.height;
    select = 1;
    orderType = 1;
    myorder: Order;
    bidOrAsk: boolean;
    sells: OrderItem[] = [];
    buys: OrderItem[] = [];
    aArray = [];
    bArray = [];
    txOrders: TxRecord[] = [];
    currentPrice = 0;
    currentQuantity = 0;
    change24h = 0;
    totalBuy = 0.0;
    totalSell = 0.0;
    buyPrice = 0;
    buyQty = 0;
    sellPrice = 0;
    sellQty = 0;
    price = 0;
    qty = 0;
    web3: any;
    pin: string;
    modalRef: BsModalRef;
    baseCoinAvail: number;
    targetCoinAvail: number;
    refreshTokenDone: boolean;
    timer: any;
    oldNonce: number;
    socket: WebSocketSubject<OrderBookItem>;
    socket2: WebSocketSubject<TradeItem>;
    sub: any;
    baseCoin: number;
    targetCoin: number;
    //interval;

    constructor(private ordServ: OrderService, private _router: Router, private web3Serv: Web3Service, private coinService: CoinService,
      private kanbanService: KanbanService, private utilService: UtilService, private walletService: WalletService, 
      private fb: FormBuilder, private modalService: BsModalService, private _snackBar: MatSnackBar, private tradeService: TradeService, 
      private route: ActivatedRoute) {
        this.web3 = this.web3Serv.getWeb3Provider();
        this.refreshTokenDone = true; 
        /*
        this.interval = setInterval(() => {
          this.refreshOrders();
        },2000)
        */
    }

    ngOnDestroy() {
      if (this.socket) {
        this.socket.unsubscribe();
      }
      this.sub.unsubscribe();
    }

    addTo(orderArr, bidOrAsk: boolean) {
      orderArr = orderArr.slice(0, 10);
      if (bidOrAsk) {
        this.buys = [];
      } else {
        this.sells = [];
        orderArr = orderArr.reverse();
      }
      for (let i = 0 ; i < orderArr.length; i++) {
        const orderItem = orderArr[i];
        const res = orderItem.toString().split(',');

        const price = Number(res[0]);
        const amount = Number(res[1]);
        const item = {
          amount: amount,
          price: price          
        }; 
        if (bidOrAsk) {
          this.buys.push(item);
        } else {
          this.sells.push(item);
        }        
      }      
    }

    refreshOrders() {
      console.log('this.baseCoin====' + this.baseCoin);
      console.log('this.targetCoin====' + this.targetCoin);

      const baseCoinName = this.coinService.getCoinNameByTypeId(this.baseCoin).toLowerCase();
      const targetCoinName = this.coinService.getCoinNameByTypeId(this.targetCoin).toLowerCase();      
      const pair = baseCoinName + targetCoinName;
      // console.log('pair = ' + pair);
      const connUrl = 'wss://stream.binance.com:9443/ws/' + pair + '@depth10@1000ms';
      console.log('connUrl=' + connUrl);
      this.socket = new WebSocketSubject(connUrl);
      this.socket.subscribe(
        (orders) => {
          // console.log('orders in refreshOrders');
          // console.log(orders);
          this.addTo(orders.asks, false);
          this.addTo(orders.bids, true);
        },
        (err) => {
          console.log('err:', err);
        },
        () => {
          console.log('Completed');
        }
      );
      
      this.socket2 = new WebSocketSubject('wss://stream.binance.com:9443/ws/' + pair + '@trade');
      this.socket2.subscribe(
        (item) => {
          // console.log('tradeItem=');
          // console.log(item);
          const price = Number(item.p);
          const quantity = Number(item.q);
          const buyerMarketMaker = item.m;
          const txItem = {
              price: price,
              quantity: quantity,
              m: buyerMarketMaker,
              time: new Date(item.t * 1000)     
          };
          this.currentPrice = price;
          this.currentQuantity = quantity;
          if (this.txOrders.length > 22) {
            this.txOrders.splice(0, 1);
          }
          this.txOrders.push(txItem);
        },
        (err) => {
          console.log('err:', err);
        },
        () => {
          console.log('Completed');
        }
      );

    }

    /*
    onRefreshToken(tokens) {
      console.log('onRefreshToken in orderPad');
      if (!this.utilService.arraysEqual(tokens, this.mytokens)) {
        this.mytokens = tokens;
        this.refreshTokenDone = true;
      }
      
    }
    */
   @Input()
   set mytokens(mytokens: any) {
     this._mytokens = mytokens;

     if (mytokens && mytokens.length > 0) {
      for (let i = 0; i < mytokens.length; i++) {
        if (this.mytokens[i].coinType === this.baseCoin.toString()) {
          this.baseCoinAvail = Number(this.mytokens[i].unlockedAmount) / 1e18;
        }
        if (this.mytokens[i].coinType === this.targetCoin.toString()) {
          this.targetCoinAvail = Number(this.mytokens[i].unlockedAmount) / 1e18;
        }  
      }
      this.refreshOrders();    
    }        
   }
 
   get mytokens(): any { return this._mytokens; }

    ngOnInit() {
      this.oldNonce = -1;

      this.sub = this.route.params.subscribe(params => {
        const pair = params['pair']; // (+) converts string 'id' to a number
        console.log('pair=' + pair);
        const pairArray = pair.split('_');
        this.baseCoin = this.coinService.getCoinTypeIdByName(pairArray[0]);
        this.targetCoin = this.coinService.getCoinTypeIdByName(pairArray[1]);


         
        // this.loadChart(pairArray[0], pairArray[1]);
        // In a real app: dispatch action to load the details here.
     });      

    }

// This method provides a unique value to track orders with.
    generateOrderHash (bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration) {
        const randomString = secureRandom.randomUint8Array(32).map(String).join('');
        const concatString = [bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration, randomString].join('');
        return this.web3.utils.sha3(concatString);
    }

    selectOrder(ord: number) {
        this.select = ord;
    }

    confirmPin() {
      sessionStorage.setItem('pin', this.pin);
      this.buyOrSell();
      this.modalRef.hide();
    }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    }

    buy(pinModal: TemplateRef<any>) {
      if (!this.wallet) {
        this.openSnackBar('please create wallet before placing order', 'ok');
        return;
      }
      this.bidOrAsk = true;
      this.pin = sessionStorage.getItem('pin');
      this.price = this.buyPrice;
      this.qty = this.buyQty;      
      if (this.pin) {
        this.buyOrSell();
      } else {
        this.openModal(pinModal);
      }
      
    }

    sell(pinModal: TemplateRef<any>) {
      if (!this.wallet) {
        this.openSnackBar('please create wallet before placing order','ok');
        return;
      }      
      this.bidOrAsk = false;
      this.pin = sessionStorage.getItem('pin');
      this.price = this.sellPrice;
      this.qty = this.sellQty;          
      if (this.pin) {    
        this.buyOrSell();
      } else {
        this.openModal(pinModal);
      }
      
    }

    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, { class: 'second' });
    }

    async buyOrSell() {
        console.log('buy something');
        this.refreshTokenDone = false;
        // const pin = '1qaz@WSX';
        console.log('this.pin' + this.pin + ',this.price=' + this.price + ',this.qty=' + this.qty);
        const seed = this.utilService.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        const keyPairsKanban = this.coinService.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const orderType = 1;
        let baseCoin = this.baseCoin;
        let targetCoin = this.targetCoin;
        if (!this.bidOrAsk) {
          baseCoin = this.targetCoin;
          targetCoin = this.baseCoin;
        }
        const timeBeforeExpiration = 423434342432;

        console.log('before getExchangeAddress');

        const address = await this.kanbanService.getExchangeAddress();
          console.log('address is for getExchangeAddress:' + address);
          const orderHash = this.generateOrderHash(this.bidOrAsk, orderType, baseCoin
            , targetCoin, this.qty, this.price, timeBeforeExpiration);
  
          const abiHex = this.web3Serv.getCreateOrderFuncABI([this.bidOrAsk,  
            orderType, baseCoin, targetCoin, (Math.floor(this.qty * 1e18)).toString(), (Math.floor(this.price * 1e18)).toString(), 
            timeBeforeExpiration,  orderHash]);
            console.log('abiHex=', abiHex);
          const nonce = await this.kanbanService.getTransactionCount(keyPairsKanban.address);
          if (this.oldNonce === nonce) {
            this.openSnackBar('Please wait a sec, no rush.', 'ok');
            return;
          }
          console.log('noncenoncenoncenoncenoncenoncenonce=' + nonce);
          const includeCoin = true;
          const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, includeCoin); 
            console.log('txhex=', txhex);
          this.kanbanService.sendRawSignedTransaction(txhex).subscribe((resp: TransactionResp) => {
  
              if (resp && resp.transactionHash) {
                this.openSnackBar('Your order was placed successfully.', 'Ok');
                this.oldNonce = nonce;
                const transaction = {
                  orderHash: orderHash,
                  txid: resp.transactionHash,
                  baseCoin: baseCoin,
                  targetCoin: targetCoin,
                  bidOrAsk: this.bidOrAsk,
                  qty: this.qty,
                  status: '',
                  created_at: new Date(Date.now()),
                  price: this.price
                };
                this.tradeService.addTransactions(transaction);

                this.timer = setInterval(() => {
                  this.refreshToken.emit();
                  console.log('this.refreshTokenDone=', this.refreshTokenDone);
                  if (this.refreshTokenDone) {
                    clearInterval(this.timer);
                  }
                }, 1000);                
                
              } else {
                this.openSnackBar('Something wrong while placing your order.', 'Ok');
              }
          });
        
    }

  
}
