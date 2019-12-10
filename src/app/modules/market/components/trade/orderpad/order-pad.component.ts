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
import { AlertService } from '../../../../../services/alert.service';
import { StorageService } from '../../../../../services/storage.service';
import { environment } from '../../../../../../environments/environment';
import { TimerService } from '../../../../../services/timer.service';

declare let window: any;
@Component({
    selector: 'app-order-pad',
    templateUrl: './order-pad.component.html',
    styleUrls: ['./order-pad.component.css']
})

export class OrderPadComponent implements OnInit, OnDestroy {

    wallet: Wallet;
    private _mytokens: any;

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
    pin: string;
    modalRef: BsModalRef;
    baseCoinAvail: number;
    targetCoinAvail: number;
    refreshTokenDone: boolean;
    timer: any;
    oldNonce: number;
    socket: WebSocketSubject<OrderBookItem>;
    tradesSocket: WebSocketSubject<TradeItem>;
    sub: any;
    baseCoin: number;
    targetCoin: number;
    // interval;

    constructor(private storageServ: StorageService, private web3Serv: Web3Service, private coinService: CoinService,
      private kanbanService: KanbanService, public utilService: UtilService, private walletService: WalletService, 
      private fb: FormBuilder, private modalService: BsModalService, private tradeService: TradeService, 
      private route: ActivatedRoute, private alertServ: AlertService, private timerServ: TimerService) {
        this.refreshTokenDone = true; 
    }

    ngOnDestroy() {
      if (this.socket) {
        this.socket.unsubscribe();
      }
      if (this.tradesSocket) {
        this.tradesSocket.unsubscribe();
      }      
      this.sub.unsubscribe();
      clearInterval(this.timer);
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

        const price = Number(orderItem.price);
        const amount = Number(orderItem.orderQuantity);
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

      const baseCoinName = this.coinService.getCoinNameByTypeId(this.baseCoin);
      const targetCoinName = this.coinService.getCoinNameByTypeId(this.targetCoin);      
      const pair = targetCoinName + baseCoinName;
      // console.log('pair = ' + pair);

      this.socket = new WebSocketSubject(environment.websockets.orders + '@' + pair);
      this.socket.subscribe(
        (orders: any) => {
          // console.log('orders in refreshOrders');
          // console.log(orders);
          this.addTo(orders.sell, false);
          this.addTo(orders.buy, true);
        },
        (err) => {
          console.log('err:', err);
        },
        () => {
          console.log('Completed');
        }
      );
      
      this.tradesSocket = new WebSocketSubject(environment.websockets.trades + '@' + pair);
      this.tradesSocket.subscribe(
        (trades: any) => {
          this.txOrders = [];
          // console.log('trades.length=', trades.length);
          for (let i = 0; i < trades.length; i++) {
            const item = trades[i];
            const price = Number(item.price);
            const quantity = Number(item.amount);
            const buyerMarketMaker = item.bidOrAsk;
            const txItem = {
                price: price,
                quantity: quantity,
                m: buyerMarketMaker,
                time: new Date(item.time * 1000)     
            };
            this.currentPrice = price;
            this.currentQuantity = quantity;
            if (this.txOrders.length > 22) {
              break;
            }
            this.txOrders.push(txItem);
          }

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
   setMytokens(mytokens: any) {
     this._mytokens = mytokens;
     if (this.baseCoin && this.targetCoin) {
      if (mytokens && mytokens.length > 0) {
        for (let i = 0; i < mytokens.length; i++) {
          if (mytokens[i].coinType === this.baseCoin.toString()) {
            this.baseCoinAvail = Number(mytokens[i].unlockedAmount);
          }
          if (mytokens[i].coinType === this.targetCoin.toString()) {
            this.targetCoinAvail = Number(mytokens[i].unlockedAmount);
          }  
        }
      }  
     } 
      
   }
   
   buyable() {
     const avail = Number(this.utilService.showAmount(this.baseCoinAvail.toString()));
     const consume = this.buyPrice * this.buyQty;
     if (avail >= consume) {
       return true;
     }
     return false;
   }

   sellable() {
    const avail = Number(this.utilService.showAmount(this.targetCoinAvail.toString()));
    const consume = this.sellQty;
    if (avail >= consume) {
      return true;
    }
    return false;     
   }

   getMytokens(): any { return this._mytokens; }

   async ngOnInit() {
      this.oldNonce = -1;
      this.wallet = await this.walletService.getCurrentWallet();

      if (this.wallet) {
          const address = this.wallet.excoin.receiveAdds[0].address;
          this.timerServ.checkTokens(address, 1);
      }


      this.timerServ.tokens.subscribe(
          (tokens: any) => { 
              console.log('tokens=', tokens);
              this.setMytokens(tokens);
          }            
      ); 

      this.sub = this.route.params.subscribe(params => {
        const pair = params['pair']; // (+) converts string 'id' to a number
        console.log('pair=' + pair);
        const pairArray = pair.split('_');
        this.baseCoin = this.coinService.getCoinTypeIdByName(pairArray[1]);
        this.targetCoin = this.coinService.getCoinTypeIdByName(pairArray[0]);
        this.refreshOrders();     
        // this.loadChart(pairArray[0], pairArray[1]);
        // In a real app: dispatch action to load the details here.
     });      

    }

// This method provides a unique value to track orders with.
    generateOrderHash (bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration) {
        const randomString = secureRandom.randomUint8Array(32).map(String).join('');
        const concatString = [bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration, randomString].join('');
        return this.web3Serv.sha3(concatString);
    }

    selectOrder(ord: number) {
        this.select = ord;
    }

    confirmPin() {
      sessionStorage.setItem('pin', this.pin);
      this.buyOrSell();
      this.modalRef.hide();
    }

    buy(pinModal: TemplateRef<any>) {
      if (!this.wallet) {
        this.alertServ.openSnackBar('please create wallet before placing order', 'ok');
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
        this.alertServ.openSnackBar('please create wallet before placing order', 'ok');
        return;
      }      
      if (this.targetCoinAvail < this.sellQty) {
        this.alertServ.openSnackBar('You have not enough ' + this.coinService.getCoinNameByTypeId(this.targetCoin), 'ok');
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

    async txHexforPlaceOrder
    (pin: string, wallet: any, bidOrAsk: boolean, baseCoin: number, targetCoin: number, price: number, qty: number) {
      const seed = this.utilService.aesDecryptSeed(wallet.encryptedSeed, pin);
      const keyPairsKanban = this.coinService.getKeyPairs(wallet.excoin, seed, 0, 0);
      const orderType = 1;
      if (!bidOrAsk) {
        const tmp = baseCoin;
        baseCoin = targetCoin;
        targetCoin = tmp;
      }

      console.log('baseCoin=' + baseCoin);
      console.log('targetCoin=' + targetCoin);
      console.log('bidOrAsk=' + bidOrAsk);
      const timeBeforeExpiration = 423434342432;

      const address = await this.kanbanService.getExchangeAddress();
      const orderHash = this.generateOrderHash(bidOrAsk, orderType, baseCoin
          , targetCoin, qty, price, timeBeforeExpiration);

      const abiHex = this.web3Serv.getCreateOrderFuncABI([bidOrAsk,  
          orderType, baseCoin, targetCoin, (Math.floor(qty * 1e18)).toString(), (Math.floor(price * 1e18)).toString(), 
          timeBeforeExpiration, false,  orderHash]);
      const nonce = await this.kanbanService.getTransactionCount(keyPairsKanban.address);

      /*
      if (this.oldNonce === nonce) {
          this.alertServ.openSnackBar('Please wait a sec, no rush.', 'ok');
          return;
      }
      */
      const includeCoin = true;
      const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, includeCoin); 
      return {
        txHex: txHex,
        orderHash: orderHash
      };
    }

    async buyOrSell() {
        this.refreshTokenDone = false;
        const {txHex, orderHash} = await this.txHexforPlaceOrder(
          this.pin, this.wallet, this.bidOrAsk, this.baseCoin, this.targetCoin, this.price, this.qty
        );

        this.kanbanService.sendRawSignedTransaction(txHex).subscribe((resp: TransactionResp) => {

        if (resp && resp.transactionHash) {
                this.alertServ.openSnackBar('Your order was placed successfully.', 'Ok');
                // this.oldNonce = nonce;

                /*
                const transaction = {
                  orderHash: orderHash,
                  txid: resp.transactionHash,
                  baseCoin: this.baseCoin,
                  targetCoin: this.targetCoin,
                  bidOrAsk: this.bidOrAsk,
                  qty: this.qty,
                  status: '',
                  created_at: new Date(Date.now()),
                  price: this.price
                };
                this.storageServ.addTradeTransaction(transaction);
                */

               const address = this.wallet.excoin.receiveAdds[0].address;
               this.timerServ.checkOrderStatus(address, 30);
               this.timerServ.checkTokens(address, 30);

                if (this.bidOrAsk) {
                  this.buyPrice = 0;
                  this.buyQty = 0;
                } else {
                  this.sellPrice = 0;
                  this.sellQty = 0;                  
                }
                
                /*
                this.timer = setInterval(() => {
                  this.refreshToken.emit();
                  console.log('this.refreshTokenDone=', this.refreshTokenDone);
                  if (this.refreshTokenDone) {
                    clearInterval(this.timer);
                  }
                }, 1000);     
                */          
                
              } else {
                this.alertServ.openSnackBar('Something wrong while placing your order.', 'Ok');
              }
        });        
    }

  
}
