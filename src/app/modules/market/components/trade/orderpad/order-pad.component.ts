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
import BigNumber from 'bignumber.js/bignumber';
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

    bigmul(num1, num2) {
      const x = new BigNumber(num1);
      const result = x.times(num2);
      console.log('result=', result);
      return result;
    }



    syncOrders ( newOrderArr, oldOrderArr, bidOrAsk: boolean) {
      let i = 0;
      let j = 0;

      for (j = 0; j < oldOrderArr.length; j++) {
        const oldOrderItem = oldOrderArr[j];
        oldOrderItem.checked = false;
      }     
      for (i = (bidOrAsk ? 0 : (newOrderArr.length - 1)); bidOrAsk ? (i < newOrderArr.length) : (i >= 0) ; bidOrAsk ? (i++) : (i--)) {

        const newOrderItem = newOrderArr[i];

        const newPrice = Number(newOrderItem.price);
        const newAmount = Number(newOrderItem.orderQuantity);
        const newOrderHash = newOrderItem.orderHash; 

        let newOrderHashExisted = false;
        for (j = 0; j < oldOrderArr.length; j++) {
          const oldOrderItem = oldOrderArr[j];
          const oldOrderHashArr = oldOrderItem.orderHashArr;
          const oldPrice = oldOrderItem.price;
          if (oldOrderHashArr.includes(newOrderHash)) {
            oldOrderItem.checked = true;
            newOrderHashExisted = true;
            break;
          }

          if (oldPrice === newPrice) {
            oldOrderItem.checked = true;
            oldOrderItem.amount += newAmount;
            oldOrderHashArr.push(newOrderHash);
            newOrderHashExisted = true;
            break;
          }

          if (oldPrice < newPrice) {
            break;
          }
        }

        if (newOrderHashExisted) {
          continue;
        }

        const item = {
          amount: newAmount,
          price: newPrice,
          checked: true,
          orderHashArr: [newOrderHash]          
        };
        
        oldOrderArr.splice(j, 0, item);
      }

      
      for (j = 0; j < oldOrderArr.length; j++) {
        const oldOrderItem = oldOrderArr[j];
        if (!oldOrderItem.checked) {
          oldOrderArr.splice(j, 1);
          j --;
        }
      } 
            
    }    
    /*
    addToOrderArray(orderArray, item, trimTag) {
      let i = 0;
      const maxOrdersCount = 10;


      
        if (trimTag === 'top') {

          for (i = 0; i < orderArray.length; i++) {
            const orderItem = orderArray[i];
            if (orderItem.orderHash.includes(item.orderHash[0])) {
              return;
            }            
            if (orderItem.price === item.price) {
              orderItem.amount += item.amount;
              orderItem.orderHash.push(item.orderHash[0]);
              return;
            } else
            if (orderItem.price < item.price) {
              break;
            }
          }
          orderArray.splice(i, 0, item);
          if (orderArray.length > maxOrdersCount) {
          orderArray.shift();
          }
        } else 
        if (trimTag === 'bottom') {

          
          for (i = 0; i < orderArray.length; i++) {
            const orderItem = orderArray[i];
            if (orderItem.orderHash.includes(item.orderHash[0])) {
              return;
            }            
            if (orderItem.price === item.price) {
              orderItem.amount += item.amount;
              orderItem.orderHash.push(item.orderHash[0]);
              return;
            } else            
            if (orderItem.price < item.price) {
              break;
            }
          }
          orderArray.splice(i, 0, item);
          if (orderArray.length > maxOrdersCount) {
          orderArray.pop();  
          }        
        }

    }

    addTo(orderArr, bidOrAsk: boolean) {
      orderArr = orderArr.slice(0, 10);
      if (bidOrAsk) {
        // this.buys = [];
      } else {
        // this.sells = [];
        orderArr = orderArr.reverse();
      }
      for (let i = 0 ; i < orderArr.length; i++) {
        const orderItem = orderArr[i];

        // console.log('orderItem=', orderItem);
        const price = Number(orderItem.price);
        const amount = Number(orderItem.orderQuantity);
        const orderHash = orderItem.orderHash;
        const item = {
          amount: amount,
          price: price,
          orderHash: [orderHash]          
        }; 
        if (bidOrAsk) {
          this.addToOrderArray(this.buys, item, 'bottom');
        } else {
          this.addToOrderArray(this.sells, item, 'top');
        }        
      } 
      
      if (bidOrAsk) {
        this.checkIfDeleted(this.buys, orderArr);
      } else {
        this.checkIfDeleted(this.sells, orderArr);
      }
    }
    */
    checkIfDeleted(existedArray, incomingArray) {
      for (let i = 0; i < existedArray.length; i ++) {
        const existedItem = existedArray[i];
        for (let j = 0; j < incomingArray.length; j++) {
          const incomingItem = incomingArray[j];
          if (existedItem.orderHash.includes(incomingItem.orderHash)) {
            return;
          }
        }
        existedArray.splice(i, 1);
        i --;
      }
    }

    refreshOrders() {
      this.sells = [];
      this.buys = [];
      this.txOrders = [];
      this.currentPrice = 0;
      this.currentQuantity = 0;

      const baseCoinName = this.coinService.getCoinNameByTypeId(this.baseCoin);
      const targetCoinName = this.coinService.getCoinNameByTypeId(this.targetCoin);      
      const pair = targetCoinName + baseCoinName;
      // console.log('pair = ' + pair);

      if (this.socket) {
        this.socket.unsubscribe();
      }
      this.socket = new WebSocketSubject(environment.websockets.orders + '@' + pair);
      this.socket.subscribe(
        (orders: any) => {
          this.syncOrders(orders.sell, this.sells, false);
          this.syncOrders(orders.buy, this.buys, true);
          // this.addTo(orders.sell, false);
          // this.addTo(orders.buy, true);
        },
        (err) => {
          console.log('err:', err);
        },
        () => {
          console.log('Completed');
        }
      );

      if (this.tradesSocket) {
        this.tradesSocket.unsubscribe();
      }      
      this.tradesSocket = new WebSocketSubject(environment.websockets.trades + '@' + pair);
      this.tradesSocket.subscribe(
        (trades: any) => {
          trades = trades.reverse();
          // this.txOrders = [];
          // console.log('trades=', trades);
          for (let i = 0; i < trades.length; i++) {
            
            const item = trades[i];
            const tradeTime = new Date(item.time * 1000);

            let tradeExisted = false;

            const price = Number(item.price);
            const quantity = Number(item.amount);
            const buyerMarketMaker = item.bidOrAsk;
            const orderHash1 = item.orderHash1;
            const orderHash2 = item.orderHash2;
            if (i === trades.length - 1) {
              this.currentPrice = price;
              this.currentQuantity = quantity;
            }
            // console.log('tradeTime=', tradeTime);
            for (let j = 0; j < this.txOrders.length; j++) {
              // console.log('this.txOrders[j].time=', this.txOrders[j].time);

              const orderH1 = this.txOrders[j].orderHash1;
              const orderH2 = this.txOrders[j].orderHash2;
              if ((orderH1 === orderHash1) && (orderH2 === orderHash2)) {
                tradeExisted = true;
                // console.log('tradeExisted1=', tradeExisted);
                break;
              }
              // console.log('tradeExisted2=', tradeExisted);
            }
            // console.log();
            
            if (tradeExisted) {
              continue;
            }            
            const txItem = {
                price: price,
                quantity: quantity,
                m: buyerMarketMaker,
                time: tradeTime,
                orderHash1: orderHash1,
                orderHash2: orderHash2
            };

            if (this.txOrders.length > 20) {
              //break;
              this.txOrders.pop();
            }
            this.txOrders.unshift(txItem);
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
    if ((this.buyPrice <= 0) || (this.buyQty <= 0)) {
      return false;
    }     
     if (!this.baseCoinAvail) {
       return false;
     }
     const avail = Number(this.utilService.showAmount(this.baseCoinAvail.toString()));
     const consume = this.buyPrice * this.buyQty;
     if (avail >= consume) {
       return true;
     }
     return false;
   }

   sellable() {
    if ((this.sellPrice <= 0) || (this.sellQty <= 0)) {
      return false;
    }
    if (!this.targetCoinAvail) {
      return false;
    }     
    const avail = Number(this.utilService.showAmount(this.targetCoinAvail.toString()));
    const consume = this.sellQty;
    if (avail >= consume) {
      return true;
    }
    return false;     
   }

   getMytokens(): any { return this._mytokens; }

   async ngOnInit() {
     console.log('ngOnInit for order Pad');
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
        console.log('pair for refresh pageeee=' + pair);
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

          console.log('resp in here', resp);
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
        },
        error => {
          console.log('errrrr=', error);
          this.alertServ.openSnackBar(error.error, 'Ok');
        }
        );        
    }

  
}
