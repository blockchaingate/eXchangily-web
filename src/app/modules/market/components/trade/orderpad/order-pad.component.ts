import { Component, TemplateRef, Input, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// import { Order } from '../../../models/order';
import { Order, OrderBookItem, OrderItem, TradeItem } from '../../../../../interfaces/kanban.interface';
import { TxRecord } from '../../../models/order-book';
import { Web3Service } from '../../../../../services/web3.service';
import { KanbanService } from '../../../../../services/kanban.service';
import { TradeService } from '../../../services/trade.service';
import { TransactionReceiptResp, Transaction } from '../../../../../interfaces/kanban.interface';

import { UtilService } from '../../../../../services/util.service';
import { WalletService } from '../../../../../services/wallet.service';
import { CoinService } from '../../../../../services/coin.service';
import { Wallet } from '../../../../../models/wallet';
import * as randombytes from 'randombytes';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionResp } from '../../../../../interfaces/kanban.interface';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../services/alert.service';
import { StorageService } from '../../../../../services/storage.service';
import { environment } from '../../../../../../environments/environment';
import { TimerService } from '../../../../../services/timer.service';
import BigNumber from 'bignumber.js';

import { Pair, defaultPairsConfig } from '../../../models/pair';
import { ApiService } from 'src/app/services/api.service';
import { WsService } from 'src/app/services/ws.service';


declare let window: any;
//http://localhost:4200/market/trade/kbeth_kbfab
@Component({
  selector: 'app-order-pad',
  templateUrl: './order-pad.component.html',
  styleUrls: ['./order-pad.component.css']
})

export class OrderPadComponent implements OnInit, OnDestroy {
  //pairsConfig: any;
  //pairConfig: any = { name: 'BTCUSDT', priceDecimal: 2, qtyDecimal: 6 };

  priceDecimal: number = 2;
  qtyDecimal: number = 6;

  pairName: any = '';
  wallet: any;
  private _mytokens: any;
  screenheight = screen.height;
  select = 1;
  orderType = 1;
  myorders: Order[];
  bidOrAsk: boolean;
  sells: OrderItem[] = [];
  buys: OrderItem[] = [];
  mySellPrices: string[] = [];
  myBuyPrices: string[] = [];
  aArray = [];
  bArray = [];
  txOrders: TxRecord[] = [];
  currentPrice = 0;
  currentQuantity = 0;
  change24h = 0;
  totalBuy = 0.0;
  totalSell = 0.0;
  buyPrice = 0;
  validBuyPrice = 0;
  buyQty = 0;
  validBuyQty = 0;
  sellPrice = 0;
  validSellPrice = 0;
  sellQty = 0;
  validSellQty = 0;
  price = 0;
  qty = 0;
  trades: any;
  pin: any;
  modalRef: BsModalRef;
  baseCoinAvail: number;
  targetCoinAvail: number;
  refreshTokenDone: boolean;
  timer: any;
  oldNonce: number;
  socket: WebSocketSubject<OrderBookItem>;
  tradesSocket: WebSocketSubject<TradeItem>;
  sub: any;
  baseCoin: string;
  targetCoin: string;
  buyGasPrice: number;
  buyGasLimit: number;
  sellGasPrice: number;
  sellGasLimit: number;
  gasPrice: number;
  gasLimit: number;
  errMsg = '';
  buyTransFeeAdvance = 0.0;
  sellTransFeeAdvance = 0.0;
  coinService: CoinService;
  lan: any = 'en';
  pairData: any;
  // interval;

  mySubscription: any;

  constructor(private storageServ: StorageService, private web3Serv: Web3Service, private _coinServ: CoinService,
    private kanbanService: KanbanService, public utilService: UtilService, private walletService: WalletService,
    private fb: FormBuilder, private modalService: BsModalService, private tradeService: TradeService,
    private apiServ: ApiService,
    private route: ActivatedRoute, private alertServ: AlertService, private timerServ: TimerService,
  private wsService: WsService) {
    this.refreshTokenDone = true;
    this.coinService = _coinServ;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.unsubscribe();
    }
    if (this.tradesSocket) {
      this.tradesSocket.unsubscribe();
    }
    if(this.sub) {
      this.sub.unsubscribe();
    }
    if(this.timer) {
      clearInterval(this.timer);
    }
  }

  bigmul(num1, num2) {
    const x = new BigNumber(num1.toString());
    const result = x.times(num2);
    return result;
  }

  bigdiv(num1, num2) {
    const x = new BigNumber(num1.toString());
    const result = x.dividedBy(num2);
    return result;
  }

  showBuysAmount(buys: any, index: number) {
    if (!buys) {
      return 0;
    }

    let amountBig = new BigNumber(0);
    for (let i = 0; i <= index; i++) {
      const buy = buys[i];
      amountBig = amountBig.plus(new BigNumber(buy.q));
    }

    return amountBig.toNumber();
  }

  checkRegExp(value: string, decimal: number) {
    if (value === '') { return true; }

    let regEx = '^\\d+$';
    if (decimal > 0) {
      regEx = '^\\d+(\\.\\d{0,' + decimal + '})?$';
    }
    const regexpNumber = new RegExp(regEx);
    return regexpNumber.test(value);
  }

  setValidValue(value: number, decimal: number) {
    const svalue = value.toString();
    const dotl = svalue.indexOf('.');
    if (dotl < 1) {
      return value;
    }
    if (svalue.length - svalue.indexOf('.') - 1 > decimal) {
      // return value.toFixed(decimal);
      return 0;
    }
    return value;
  }

  checkBuyPrice() {
    const vald = this.checkRegExp(this.buyPrice.toString(), this.priceDecimal);
    if (vald) {
      this.validBuyPrice = this.buyPrice;
    } else {
      this.validBuyPrice = this.setValidValue(this.validBuyPrice, this.priceDecimal);
      this.buyPrice = this.validBuyPrice;
    }
  }

  checkBuyQty() {
    const vald = this.checkRegExp(this.buyQty.toString(), this.qtyDecimal);
    if (vald) {
      this.validBuyQty = this.buyQty;
    } else {
      this.validBuyQty = this.setValidValue(this.validBuyQty, this.qtyDecimal);
      this.buyQty = this.validBuyQty;
    }
  }

  checkSellPrice() {
    const vald = this.checkRegExp(this.sellPrice.toString(), this.priceDecimal);
    if (vald) {
      this.validSellPrice = this.sellPrice;
    } else {
      this.validSellPrice = this.setValidValue(this.validSellPrice, this.priceDecimal);
      this.sellPrice = this.validSellPrice;
    }
  }

  checkSellQty() {

    const vald = this.checkRegExp(this.sellQty.toString(), this.qtyDecimal);
    if (vald) {
      this.validSellQty = this.sellQty;
    } else {
      this.validSellQty = this.setValidValue(this.validSellQty, this.qtyDecimal);
      this.sellQty = this.validSellQty;
    }
  }

  toDecimal(amount: number, decimal: number) {
    return amount.toFixed(decimal);
  }

  showSellsAmount(sells: any, index: number) {
    if (!sells) {
      return 0;
    }

    let amountTotal = new BigNumber(0);
    for (let i = sells.length - 1; i >= index; i--) {
      const sell = sells[i];
      amountTotal = amountTotal.plus(new BigNumber(sell.q));
    }

    return amountTotal.toNumber();
  }

  syncOrders(newOrderArr, oldOrderArr, bidOrAsk: boolean) {
    // console.log('begin newOrderArr=', newOrderArr);
    // console.log('begin oldOrderArr=', oldOrderArr);
    let i = 0;
    let j = 0;
    let k = 0;
    for (j = 0; j < oldOrderArr.length; j++) {
      const oldOrderItem = oldOrderArr[j];
      for (i = 0; i < oldOrderItem.checkedArr.length; i++) {
        oldOrderItem.checkedArr[i] = false;
      }
    }
    for (i = (bidOrAsk ? 0 : (newOrderArr.length - 1)); bidOrAsk ? (i < newOrderArr.length) : (i >= 0); bidOrAsk ? (i++) : (i--)) {
      const newOrderItem = newOrderArr[i];

      const newPrice = Number(newOrderItem.p);
      const newAmount = Number(newOrderItem.q);
      const newOrderHash = newOrderItem.orderHash;

      let newOrderHashExisted = false;
      for (j = 0; j < oldOrderArr.length; j++) {
        const oldOrderItem = oldOrderArr[j];
        const oldOrderHashArr = oldOrderItem.orderHashArr;
        const oldPrice = oldOrderItem.price;

        /*
        if (oldOrderHashArr.includes(newOrderHash)) {
          oldOrderItem.checked = true;
          newOrderHashExisted = true;
          break;
        }
        */

        for (k = 0; k < oldOrderHashArr.length; k++) {
          if (oldOrderHashArr[k] === newOrderHash) {
            oldOrderItem.checkedArr[k] = false;
            oldOrderItem.amountArr[k] = newAmount;
            newOrderHashExisted = true;
            break;
          }
        }

        if (oldPrice === newPrice) {
          oldOrderItem.checkedArr.push(true);
          oldOrderItem.amountArr.push(newAmount);
          oldOrderItem.percentage = newAmount * 100 / oldOrderItem.amount;
          oldOrderHashArr.push(newOrderHash);
          newOrderHashExisted = true;
          break;
        }

        if (oldPrice < newPrice) {
          break;
        }
      }

      // console.log('newOrderHashExisted=', newOrderHashExisted);
      if (newOrderHashExisted) {
        continue;
      }

      const item = {
        amountArr: [newAmount],
        price: newPrice,
        checkedArr: [true],
        percentage: 100,
        orderHashArr: [newOrderHash]
      };

      oldOrderArr.splice(j, 0, item);
    }

    for (j = 0; j < oldOrderArr.length; j++) {
      const oldOrderItem = oldOrderArr[j];
      for (k = 0; k < oldOrderItem.checkedArr.length; k++) {
        if (!oldOrderItem.checkedArr[k]) {
          oldOrderItem.checkedArr.splice(k, 1);
          oldOrderItem.orderHashArr.splice(k, 1);
          oldOrderItem.amountArr.splice(k, 1);
          k--;
        }
      }
      if (oldOrderItem.checkedArr.length === 0 || oldOrderItem.amountArr.length === 0) {
        oldOrderArr.splice(j, 1);
        j--;
      }
    }

    if (bidOrAsk) {
      while (oldOrderArr.length > 10) {
        oldOrderArr.pop();
      }
    } else {
      while (oldOrderArr.length > 10) {
        oldOrderArr.shift();
      }
    }

    // console.log('final oldOrderArr=', oldOrderArr);
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
    for (let i = 0; i < existedArray.length; i++) {
      const existedItem = existedArray[i];
      for (let j = 0; j < incomingArray.length; j++) {
        const incomingItem = incomingArray[j];
        if (existedItem.orderHash.includes(incomingItem.orderHash)) {
          return;
        }
      }
      existedArray.splice(i, 1);
      i--;
    }
  }

  toNumber(num: any) {
    return Number(num);
  }
  setBuyQtyPercent(percent: number) {
    if (this.buyPrice <= 0) {
      return;
    }

    this.buyQty = Number((new BigNumber(this.utilService.showAmount(this.bigdiv(this.baseCoinAvail, this.buyPrice), this.qtyDecimal)).multipliedBy(new BigNumber(percent))).toFixed(this.qtyDecimal));
    const avail = this.utilService.toNumber(this.utilService.showAmount(this.baseCoinAvail, 18));
    while ((new BigNumber(this.buyQty).multipliedBy(new BigNumber(this.buyPrice))).toNumber() > avail) {
      const exp = Number(-this.qtyDecimal);
      this.buyQty = Number(new BigNumber(this.buyQty).minus(new BigNumber(Math.pow(10, exp))).toFixed(this.qtyDecimal));
    }
  }

  setSellQtyPercent(percent: number) {
    this.sellQty = Number(new BigNumber(this.utilService.toNumber(this.utilService.showAmount(this.targetCoinAvail, 18))).multipliedBy(new BigNumber(percent)).toFixed(this.qtyDecimal));
    while (this.sellQty > this.utilService.toNumber(this.utilService.showAmount(this.targetCoinAvail, 18))) {
      this.sellQty -= Math.pow(10, -this.qtyDecimal);
      this.sellQty = this.utilService.toNumber(this.sellQty.toFixed(this.qtyDecimal));
    }
  }

  setPrice(price: number) {
    this.buyPrice = Number(price);
    this.sellPrice = Number(price);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  refreshOrders() {
    this.sells = [];
    this.buys = [];
    this.txOrders = [];
    this.currentPrice = 0;
    this.currentQuantity = 0;
    this.mySellPrices = [];
    this.myBuyPrices = [];

    const baseCoinName = this.baseCoin;
    const targetCoinName = this.targetCoin;
    const pair = targetCoinName + '_' + baseCoinName;
    this.pairName = pair;

    // console.log('pair = ' + pair);
    this.checkMyOrdersOfThisPair();

    if (this.socket) {
      this.socket.unsubscribe();
    }
    this.socket = new WebSocketSubject(environment.websockets.orders + '@' + pair);
    this.socket.subscribe(
      (orders: any) => {
        this.sells = orders.s.slice(0, 10).reverse();
        this.buys = orders.b.slice(0, 10);

        this.sells.forEach(se => {
          this.mySellPrices.filter(myS => +myS === se.p).length > 0 ? se.my = true : se.my = false;
        });

        this.buys.forEach(bu => {
          this.myBuyPrices.filter(myS => +myS === bu.p).length > 0 ? bu.my = true : bu.my = false;
        });

       if(environment.production) {
        for (let j = 0; j < 2; j++) {
          let randNum = Math.floor((Math.random() * this.sells.length));
          if (randNum > 0) {
            this.sells.splice(randNum, 1);
          }
          randNum = Math.floor((Math.random() * this.buys.length));
          if (randNum > 0) {
            this.buys.splice(randNum, 1);
          }
          //this.delay(500);
        }
       }

        //     }
      },
      (err) => {
        console.log('err1111:', err);
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
        if (!trades || trades.length == 0) {
          this.trades = [];
          return;
        }
        this.trades = trades.slice(0, 23);
        this.currentPrice = this.trades[0].p;
        this.currentQuantity = this.trades[0].q;
        // this.txOrders = [];
        // console.log('trades=', trades);
        /*
        for (let i = 0; i < trades.length; i++) {

          const item = trades[i];
          const tradeTime = item.t * 1000;
          console.log();
          let tradeExisted = false;

          const price = Number(item.p);
          const quantity = Number(item.q);
          const buyerMarketMaker = item.b;
          if (i === trades.length - 1) {
            this.currentPrice = price;
            this.currentQuantity = quantity;
          }
          // console.log('tradeTime=', tradeTime);
          for (let j = 0; j < this.txOrders.length; j++) {
            // console.log('this.txOrders[j].time=', this.txOrders[j].time);

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
            orderHash1: '',
            orderHash2: ''
          };

          if (this.txOrders.length > 22) {
            // break;
            this.txOrders.pop();
          }
          this.txOrders.unshift(txItem);
        }
        */
      },
      (err) => {
        console.log('err22222:', err);
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
    this.refreshCoinAvail();
  }

  refreshCoinAvail() {
    let baseCoinAvailExisted = false;
    let targetCoinAvailExisted = false;
    if (this.baseCoin && this.targetCoin && this._mytokens) {
      const tokens = this._mytokens.tokens;
      if(!tokens) {
        return;
      }
      const ids = tokens.ids;
      for(let i = 0; i < ids.length; i++) {
        const id = ids[i].toLowerCase();
        if(id == this.pairData.tokenB.id.toLowerCase()) {
          baseCoinAvailExisted = true;
          this.baseCoinAvail = new BigNumber(tokens.balances[i]).shiftedBy(-tokens.decimals[i]).toNumber();
        } else
        if(id == this.pairData.tokenA.id.toLowerCase()) {
          targetCoinAvailExisted = true;
          this.targetCoinAvail = new BigNumber(tokens.balances[i]).shiftedBy(-tokens.decimals[i]).toNumber();
        }
      }

    }
    if (!baseCoinAvailExisted) {
      this.baseCoinAvail = 0;
    }
    if (!targetCoinAvailExisted) {
      this.targetCoinAvail = 0;
    }
  }

  buyable() {
    
    if ((this.buyPrice <= 0) || (this.buyQty <= 0)) {
      return false;
    }
    if (!this.baseCoinAvail) {
      return false;
    }
    const avail = this.baseCoinAvail;
    const consume = new BigNumber(this.buyPrice).multipliedBy(new BigNumber(this.buyQty)).toNumber();
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
    const avail = this.targetCoinAvail;
    const consume = this.sellQty;
    if (avail >= consume) {
      return true;
    }
    return false;

  }

  getMytokens(): any { return this._mytokens; }

  async ngOnInit() {
    this.lan = localStorage.getItem('Lan');
    this.pairName = this.route.snapshot.paramMap.get('pair');

    console.log('go here', this.pairName);
    this.apiServ.getPairDecimals(this.pairName).then(
      (data: any) => {
        if(data) {
          this.priceDecimal = data.price;
          this.qtyDecimal = data.quantity;
        }
      }
    );

    const pairData = await this.apiServ.getPair(this.pairName);
    this.pairData = pairData;

      console.log('this.pairData===', this.pairData);
    // console.log('ngOnInit for order Pad');
    this.oldNonce = -1;
    this.buyGasLimit = environment.chains.KANBAN.gasLimit;
    this.buyGasPrice = environment.chains.KANBAN.gasPrice;
    this.sellGasLimit = environment.chains.KANBAN.gasLimit;
    this.sellGasPrice = environment.chains.KANBAN.gasPrice;
    this.wallet = await this.walletService.getCurrentWallet();

    if (this.wallet) {
      const address = this.wallet.excoin.receiveAdds[0].address;
      //console.log('address==', address);
      this.timerServ.checkTokens(address, 1);
    }

    this.timerServ.tokens.subscribe(
      (tokens: any) => {
        console.log('tokens there we go====', tokens);
        this.setMytokens(tokens);
      }
    );

    this.checkMyOrdersOfThisPair();

    //this.pairsConfig = <Pair[]>(JSON.parse(sessionStorage.getItem('pairsConfig')));

    this.sub = this.route.params.subscribe(params => {
      let pair = params['pair']; // (+) converts string 'id' to a number
      if (!pair) {
        pair = 'BTC_USDT';
      }

      // console.log('pair for refresh pageeee=' + pair);
      const pairArray = pair.split('_');
      this.baseCoin = pairArray[1];
      this.targetCoin = pairArray[0];
      this.refreshOrders();
      this.refreshCoinAvail();

      // this.loadChart(pairArray[0], pairArray[1]);
      // In a real app: dispatch action to load the details here.
    });
  }

  checkMyOrdersOfThisPair() {
    this.myBuyPrices = [];
    this.mySellPrices = [];
    this.timerServ.openOrders.subscribe(
      (orders: any) => {
        const myPairOrders = orders.filter(mo => mo.pairName === this.pairName);
        myPairOrders.forEach(ordItm => {
          const decimalPrice = this.utilService.showAmount(ordItm.price, this.priceDecimal);
            if (ordItm.bidOrAsk) {
              this.myBuyPrices.push(decimalPrice);
            } else {
              this.mySellPrices.push(decimalPrice);
            }
        });
      }
    );

  }

  // This method provides a unique value to track orders with.
  generateOrderHash(bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration) {
    const randomString = randombytes(32).map(String).join('');
    const concatString = [bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration, randomString].join('');
    return this.web3Serv.sha3(concatString);
  }

  selectOrder(ord: number) {
    this.select = ord;
  }

  confirmPin() {
    const pwdHashStr = this.utilService.SHA256(this.pin).toString();
    if (this.wallet.pwdHash !== pwdHashStr) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('密码错误', 'Ok');
      } else {
        this.alertServ.openSnackBar('Your password is invalid', 'Ok');
      }
      return;
    }
    sessionStorage.setItem('pin', this.pin);
    const thirty_minutes_from_now = new Date().getTime() + 600000 * 3;
    sessionStorage.setItem('pin_expired_at', thirty_minutes_from_now.toString());
    this.buyOrSell(false,false);
    this.modalRef.hide();
  }

  finalExpCheck(price: number, qty: number) {

    if (!this.checkRegExp(price.toString(), this.priceDecimal)) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('价格小数限' + this.priceDecimal + '位。', 'Ok');
      } else {
        this.alertServ.openSnackBar('Price decimal no more than ' + this.priceDecimal, 'ok');
      }
      return false;
    }

    if (!this.checkRegExp(qty.toString(), this.qtyDecimal)) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('购量小数限' + this.qtyDecimal + '位。', 'Ok');
      } else {
        this.alertServ.openSnackBar('Quantity decimal no more than ' + this.qtyDecimal, 'ok');
      }
      return false;
    }
    return true;
  }

  buy(pinModal: TemplateRef<any>) {


    if(this.wsService.isSocketActive){

      if (!this.finalExpCheck(this.buyPrice, this.buyQty)) { return; }
  
      this.bidOrAsk = true;
      this.pin = sessionStorage.getItem('pin');
      const pin_expired_at = sessionStorage.getItem('pin_expired_at');
      let pin_expired = true;
      if (pin_expired_at) {
        const currentTime = new Date().getTime();
        const expired_time = parseInt(pin_expired_at);
        if (currentTime < expired_time) {
          pin_expired = false;
        }
      }
      this.price = this.buyPrice;
      this.qty = this.buyQty;
      this.gasLimit = Number(this.buyGasLimit);
      this.gasPrice = Number(this.buyGasPrice);

      this.buyOrSell(true, true);
    }else{


      if (!this.wallet ) {
        if (this.lan === 'zh') {
          this.alertServ.openSnackBar('请先创建钱包才能下单', 'Ok');
        } else {
          this.alertServ.openSnackBar('please create wallet before placing order', 'ok');
        }
        return;
      }
  
      if (!this.finalExpCheck(this.buyPrice, this.buyQty)) { return; }
  
      this.bidOrAsk = true;
      this.pin = sessionStorage.getItem('pin');
      const pin_expired_at = sessionStorage.getItem('pin_expired_at');
      let pin_expired = true;
      if (pin_expired_at) {
        const currentTime = new Date().getTime();
        const expired_time = parseInt(pin_expired_at);
        if (currentTime < expired_time) {
          pin_expired = false;
        }
      }
      this.price = this.buyPrice;
      this.qty = this.buyQty;
      this.gasLimit = Number(this.buyGasLimit);
      this.gasPrice = Number(this.buyGasPrice);
      if (this.pin && !pin_expired) {
       this.buyOrSell(false,false);
      } else {
        this.openModal(pinModal);
      }


    }

  


  }

  sell(pinModal: TemplateRef<any>) {


    if(this.wsService.isSocketActive){

      if (!this.finalExpCheck(this.sellPrice, this.sellQty)) { return; }

      this.bidOrAsk = false;
      this.pin = sessionStorage.getItem('pin');
      this.price = this.sellPrice;
      this.qty = this.sellQty;
      this.gasLimit = Number(this.sellGasLimit);
      this.gasPrice = Number(this.sellGasPrice);

      this.buyOrSell(true,false);
    }else{
    





    if (!this.wallet) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('请先创建钱包才能下单', 'Ok');
      } else {
        this.alertServ.openSnackBar('please create wallet before placing order', 'ok');
      }
      return;
    }

    if (!this.finalExpCheck(this.sellPrice, this.sellQty)) { return; }

    this.bidOrAsk = false;
    this.pin = sessionStorage.getItem('pin');
    this.price = this.sellPrice;
    this.qty = this.sellQty;
    this.gasLimit = Number(this.sellGasLimit);
    this.gasPrice = Number(this.sellGasPrice);

      this.openModal(pinModal);

  }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'second' });
  }

  async txHexforPlaceOrder
    (pin: string, wallet: any, bidOrAsk: boolean, baseCoin: string, targetCoin: string, price: number, qty: number, isBuy?: boolean) {

      if (this.wsService.isSocketActive) {
  

        const orderType = 1;

        baseCoin = this.pairData.tokenB.id;
        targetCoin = this.pairData.tokenA.id;
        console.log('this.pairData===', this.pairData);
        let qtyDecimals = this.pairData.tokenA.decimals;
        console.log('qtyDecimals===', qtyDecimals);
        if (!bidOrAsk) {
          const tmp = baseCoin;
          baseCoin = targetCoin;
          targetCoin = tmp;
          //qtyDecimals = this.pairData.tokenA.decimals;
        }

        const timeBeforeExpiration = 423434342432;
        const address = this.pairData.pair.pair;
        const orderHash = this.generateOrderHash(bidOrAsk, orderType, baseCoin
          , targetCoin, qty, price, timeBeforeExpiration);

          const approveCoin = baseCoin;
          const qtyString = new BigNumber(qty).shiftedBy(qtyDecimals).toFixed();
          const priceString = new BigNumber(price).shiftedBy(18).toFixed();

          let approveQtystring = qtyString;
          if(bidOrAsk) {
            approveQtystring = new BigNumber(qty).multipliedBy(new BigNumber(price)).shiftedBy(qtyDecimals).toFixed();
          }

          const approveAbiHex = this.web3Serv.getApproveFuncABI(address, approveQtystring);


      
          const abiHex = this.web3Serv.getCreateOrderFuncABI([bidOrAsk,
            baseCoin, targetCoin, qtyString, priceString, orderHash]);
 
          const params: any = [];

          params.push(
            {
              to: approveCoin,
              data: approveAbiHex
            }
          );
      
          params.push(
            {
              to: address,
              data: abiHex
            }
          );
           
          let name = isBuy ? 'Buy' : 'Sell';

            const paramsSentSocket =
            {
              source: "Exchangily-"+name,
              data: params
            }
            this.wsService.sendMessage(paramsSentSocket);
      
      
            return {
              txHexApprove: '',
              txHex: '',
              orderHash: orderHash
            };

      }else {



    const seed = this.utilService.aesDecryptSeed(wallet.encryptedSeed, pin);
    if(!seed) {
      return;
    }
    const keyPairsKanban = this._coinServ.getKeyPairs(wallet.excoin, seed, 0, 0);
    const orderType = 1;

    baseCoin = this.pairData.tokenB.id;
    targetCoin = this.pairData.tokenA.id;
    console.log('this.pairData===', this.pairData);
    let qtyDecimals = this.pairData.tokenA.decimals;
    console.log('qtyDecimals===', qtyDecimals);
    if (!bidOrAsk) {
      const tmp = baseCoin;
      baseCoin = targetCoin;
      targetCoin = tmp;
      //qtyDecimals = this.pairData.tokenA.decimals;
    }

    const timeBeforeExpiration = 423434342432;

    //const address = await this.kanbanService.getExchangeAddress();
    const address = this.pairData.pair.pair;
    const orderHash = this.generateOrderHash(bidOrAsk, orderType, baseCoin
      , targetCoin, qty, price, timeBeforeExpiration);

    const approveCoin = baseCoin;
    const qtyString = new BigNumber(qty).shiftedBy(qtyDecimals).toFixed();
    const priceString = new BigNumber(price).shiftedBy(18).toFixed();

    let approveQtystring = qtyString;
    if(bidOrAsk) {
      approveQtystring = new BigNumber(qty).multipliedBy(new BigNumber(price)).shiftedBy(qtyDecimals).toFixed();
    }



    
    const approveAbiHex = this.web3Serv.getApproveFuncABI(address, approveQtystring);


    const abiHex = this.web3Serv.getCreateOrderFuncABI([bidOrAsk,
      baseCoin, targetCoin, qtyString, priceString, orderHash]);

    let nonce = await this.kanbanService.getTransactionCount(keyPairsKanban.address);

    if ((this.gasPrice <= 0) || (this.gasLimit <= 0)) {
      return; 
    }
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit
    };

   


    const txHexApprove = await this.web3Serv.signAbiHexWithPrivateKey(approveAbiHex, keyPairsKanban, approveCoin, nonce++, 0, options);

    const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, 0, options);


    return {
      txHexApprove,
      txHex: txHex,
      orderHash: orderHash
    };

      }


  }

  async buyOrSell(isSocketActive?: boolean, isBuy?: boolean) {
    this.refreshTokenDone = false;

    if (isSocketActive) {

      const resTxHex = await this.txHexforPlaceOrder(
        this.pin, this.wallet, this.bidOrAsk, this.baseCoin, this.targetCoin, this.price, this.qty,isBuy
      );

      const txHex: any = resTxHex?.txHex;
      const txHexApprove: any = resTxHex?.txHexApprove;

      
        const paramsSentSocket =
        {
          source: "Exchangily-Buy",
          data: txHexApprove
        }
        this.wsService.sendMessage(paramsSentSocket);
  
        const paramsSentSocket2 =
        {
          source: "Exchangily-Buy",
          data: txHex
        }
        this.wsService.sendMessage(paramsSentSocket2);
      
      
    }else{

      const resTxHex = await this.txHexforPlaceOrder(
        this.pin, this.wallet, this.bidOrAsk, this.baseCoin, this.targetCoin, this.price, this.qty
      );
  
      const txHex: any = resTxHex?.txHex;
      const txHexApprove: any = resTxHex?.txHexApprove;
  
      this.kanbanService.sendRawSignedTransaction(txHexApprove).subscribe((resp: any) => {
        if (resp && resp.transactionHash) {
          this.kanbanService.incNonce();
          this.kanbanService.sendRawSignedTransaction(txHex).subscribe((resp: any) => {
  
            if (resp && resp.transactionHash) {
              this.kanbanService.incNonce();
              if (this.lan === 'zh') {
                this.alertServ.openSnackBarSuccess('下单成功。', 'Ok');
              } else {
                this.alertServ.openSnackBarSuccess('Your order was placed successfully.', 'Ok');
              }
      
              const address = this.wallet.excoin.receiveAdds[0].address;
              this.timerServ.checkOrderStatus(address, 6);
              this.timerServ.checkTokens(address, 6);
      
              if (this.bidOrAsk) {
                this.buyPrice = 0;
                this.buyQty = 0;
              } else {
                this.sellPrice = 0;
                this.sellQty = 0;
              }
      
            } else {
              if (this.lan === 'zh') {
                this.alertServ.openSnackBar('创建订单时发生错误, 订单提交失败。', 'Ok');
              } else {
                this.alertServ.openSnackBar('Error happened while placing your order.', 'Ok');
              }
            }
          },
            error => {
              this.alertServ.openSnackBar(error.error, 'Ok');
            }
          );
        }
        
      });
  

    }

 
    }
  }


