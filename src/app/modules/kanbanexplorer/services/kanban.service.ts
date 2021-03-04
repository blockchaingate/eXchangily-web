import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Block, BlockMetainfo } from '../models/block';
import { Transaction, AddressTx, Balance, TransactionCount } from '../models/transaction';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { Coin } from '../../../models/coin';
import { KanbanBalance } from '../models/kanbanBalance';
import { WithdrawRequest } from '../models/withdrawRequest';
import { DepositRequest } from '../models/depositRequest';
import { KanbanStats } from '../models/kanbanStats';
import { Trade } from '../models/trade';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  coins: Coin[];
  // codeToCurrencyMap: Map<string, string>;
  private url: string = environment.url;

  constructor(private http: HttpClient, private router: Router) {
    // this.codeToCurrencyMap = new Map();
    // this.codeToCurrencyMap.set('196609', 'USDT');
    // this.codeToCurrencyMap.set('65536', 'BTC');
    // this.codeToCurrencyMap.set('196608', 'ETH');
    // this.codeToCurrencyMap.set('131072', 'FAB');
    // this.codeToCurrencyMap.set('131073', 'EXG');
    // this.codeToCurrencyMap.set('131074', 'DUSD');

    this.getTokenList().subscribe(cos => this.coins = cos);
  }

  getCurrencyName(num: string): string {
    const coin = this.coins.filter(c => c.coinType === parseInt(num));
    if (!coin || coin.length < 1) return '-';
    return coin[0]['tickerName'];
    // return this.codeToCurrencyMap.get(num);
  }

  getTokenList() {
    return this.http.get<Coin[]>(`${this.url}exchangily/getTokenList`);
  }

  // private tmpBlock: Block
  // private tmpTx: Transaction

  getLatestBlocks(): Observable<Block[]> {
    return this.http.get<Block[]>(this.url);
  }

  getLatestBlocksMetainfo(startBlock?: Number, onlyWithTransactions = false): Observable<BlockMetainfo[]> {
    if (onlyWithTransactions) {
      return this.http.get<BlockMetainfo[]>(`${this.url}getblockwithtxsmetainfo/` + startBlock.toString() + '/10');
    }

    if (startBlock) {
      console.log(startBlock);
      return this.http.get<BlockMetainfo[]>(`${this.url}getblocksmetainfo/` + startBlock.toString() + '/10');
    }
    return this.http.get<BlockMetainfo[]>(`${this.url}getblocksmetainfo/latest/10`);
  }

  getNextBlocksMetainfo(startBlock?: Number, onlyWithTransactions = false): Observable<BlockMetainfo[]> {

    if (onlyWithTransactions) {
      return this.http.get<BlockMetainfo[]>(`${this.url}getblockwithtxsfwdmetainfo/` + startBlock.toString() + '/10');
    }

    if (startBlock) {
      console.log(startBlock);
      return this.http.get<BlockMetainfo[]>(`${this.url}getblocksmetainfo/` + startBlock.toString() + '/10');
    }
    return this.http.get<BlockMetainfo[]>(`${this.url}getblocksmetainfo/latest/10`);
  }

  getSingleBlockByNumber(blockNum: any): Observable<Block> {
    return this.http.get<Block>(`${this.url}kanban/explorer/getblock/` + blockNum.toString());
  }

  getTxByHash(txhash: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.url}kanban/explorer/gettransaction/` + txhash);
  }

  getAddressToTx(address: string): Observable<AddressTx> {
    return this.http.get<AddressTx>(`${this.url}kanban/explorer/getaddresstxsto/` + address);
  }

  getAddressFromTx(address: string): Observable<AddressTx> {
    return this.http.get<AddressTx>(`${this.url}kanban/explorer/getaddresstxsfrom/` + address);
  }

  getAddressBalances(address: string): Observable<Balance[]> {
    return this.http.get<Balance[]>(`${this.url}exchangily/getbalances/` + address);
  }

  getAddressKanbanBalance(address: string): Observable<KanbanBalance> {
    return this.http.get<KanbanBalance>(`${this.url}kanban/getBalance/${address}`);
  }

  getAddressTxCount(address: string): Observable<TransactionCount> {
    return this.http.get<TransactionCount>(`${this.url}kanban/gettransactioncount/${address}`);
  }

  getAddressOrders(address: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}getordersbyaddress/${address}`);
  }

  getAddressWithdrawRequests(address: String): Observable<WithdrawRequest[]> {
    return this.http.get<WithdrawRequest[]>(`${this.url}withdrawrequestsbyaddress/${address}`);
  }

  getAddressDepositRequests(address: String): Observable<DepositRequest[]> {
    return this.http.get<DepositRequest[]>(`${this.url}getdepositrequestsbyaddress/${address}`);
  }

  getKanbanStats(): Observable<KanbanStats> {
    return this.http.get<KanbanStats>(`${this.url}getkanbanstats`);
  }

  getDividends(): Observable<any> {
    const url = `${this.url}exchangily/ExgDividend`;
    console.log('url==', url);
    return this.http.get<any>(url);
  }

  getLaetstOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}getlatestorders`);
  }

  getOrder(orderHash: string): Observable<Order> {
    return this.http.get<Order>(`${this.url}getOrderByOrderHash/${orderHash}`);
  } 

  getLatestTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.url}getlatesttrades`);
  }

  async validateInputAndSetRoute(val: string) {
    if (val.length < 10) {
      // most likely blocknumber
      this.router.navigate(['/explorer/block-detail/' + val]);
    } else if (val.length > 10 && val.length < 50) {
      // most likely address
      this.router.navigate(['/explorer/address-detail/' + val]);

    } else {
      // assume transaction hash - temporary solution
      this.router.navigate([`/explorer/tx-detail/${val}`]);

      /*
      //either block or transaction
      let tx: Transaction, blk: Block
      try {
        tx = await this.http.get<Transaction>(`${this.url}kanban/explorer/gettransaction/` + val).toPromise()
        this.router.navigate(['/tx-detail/' + val])
      } catch (e) {
        console.log("there is an error while tx")
        console.log(e)
      }

      if (tx === null || tx === undefined) {
        //try for block
        try {
          blk = await this.http.get<Block>(`${this.url}kanban/explorer/getblock/` + val).toPromise()
          this.router.navigate(['/block-detail/' + val])
        } catch (e) {
          console.log("there is an error while block")
          console.log(e)
        }
      }*/

    }
    // TODO check for orderhash, withdrawal requests etc.

    // return this.http.get<Transaction>("${this.url}kanban/explorer/gettransaction/" + val)
  }
}
