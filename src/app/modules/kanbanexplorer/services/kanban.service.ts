import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Block, BlockMetainfo } from '../models/block';
import { Transaction, AddressTx, Balance, TransactionCount } from '../models/transaction';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { KanbanBalance } from '../models/kanbanBalance';
import { WithdrawRequest } from '../models/withdrawRequest';
import { DepositRequest } from '../models/depositRequest';
import { KanbanStats } from '../models/kanbanStats';
import { Trade } from '../models/trade';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class KanbanService {


  codeToCurrencyMap: Map<string, string>


  private url: string = environment.url
  private tmpUrl: string = environment.tmpUrl
  
  constructor(private http: HttpClient, private router: Router) {

    this.codeToCurrencyMap = new Map()
    this.codeToCurrencyMap.set('1', "USDT")
    this.codeToCurrencyMap.set('2', "BTC")
    this.codeToCurrencyMap.set('3', "ETH")
    this.codeToCurrencyMap.set('4', "FAB")
    this.codeToCurrencyMap.set('5', "EXG")
    this.codeToCurrencyMap.set('6', "DUSD")
  }

  getCurrencyName(num:string) : string{
    return this.codeToCurrencyMap.get(num)
  }

  private tmpBlock: Block
  private tmpTx: Transaction

  getLatestBlocks(): Observable<Block[]> {
    return this.http.get<Block[]>(this.url)
  }

  getLatestBlocksMetainfo(startBlock? : Number , onlyWithTransactions=false): Observable<BlockMetainfo[]>{

    if(onlyWithTransactions){
      return this.http.get<BlockMetainfo[]>(`${this.tmpUrl}getblockwithtxsmetainfo/`+startBlock.toString()+"/10")
    }

    if(startBlock){
      console.log(startBlock)
      return this.http.get<BlockMetainfo[]>(`${this.tmpUrl}getblocksmetainfo/`+startBlock.toString()+"/10")
    }
    return this.http.get<BlockMetainfo[]>(`${this.tmpUrl}getblocksmetainfo/latest/10`)
  }

  getNextBlocksMetainfo(startBlock? : Number , onlyWithTransactions=false): Observable<BlockMetainfo[]>{

    if(onlyWithTransactions){
      return this.http.get<BlockMetainfo[]>(`${this.tmpUrl}getblockwithtxsfwdmetainfo/`+startBlock.toString()+"/10")
    }

    if(startBlock){
      console.log(startBlock)
      return this.http.get<BlockMetainfo[]>(`${this.tmpUrl}getblocksmetainfo/`+startBlock.toString()+"/10")
    }
    return this.http.get<BlockMetainfo[]>(`${this.tmpUrl}getblocksmetainfo/latest/10`)
  }


  getSingleBlockByNumber(blockNum: any): Observable<Block> {
    return this.http.get<Block>(`${this.url}kanban/explorer/getblock/` + blockNum.toString())
  }

  getTxByHash(txhash: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.url}kanban/explorer/gettransaction/` + txhash)
  }

  getAddressToTx(address: string): Observable<AddressTx> {
    return this.http.get<AddressTx>(`${this.url}kanban/explorer/getaddresstxsto/` + address)
  }

  getAddressFromTx(address: string): Observable<AddressTx> {
    return this.http.get<AddressTx>(`${this.url}kanban/explorer/getaddresstxsfrom/` + address)
  }

  getAddressBalances(address: string): Observable<Balance[]> {
    return this.http.get<Balance[]>(`${this.url}exchangily/getbalances/` + address)
  }

  getAddressKanbanBalance(address: string) : Observable<KanbanBalance>{
    return this.http.get<KanbanBalance>(`${this.url}kanban/getBalance/${address}`)
  }

  getAddressTxCount(address: string) : Observable<TransactionCount>{
    return this.http.get<TransactionCount>(`${this.url}kanban/gettransactioncount/${address}`)
  }

  getAddressOrders(address: string): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.tmpUrl}getordersbyaddress/${address}`)
  }

  getAddressWithdrawRequests(address: String): Observable<WithdrawRequest[]>{
    return this.http.get<WithdrawRequest[]>(`${this.url}withdrawrequestsbyaddress/${address}`)
  }

  getAddressDepositRequests(address: String): Observable<DepositRequest[]>{
    return this.http.get<DepositRequest[]>(`${this.tmpUrl}getdepositrequestsbyaddress/${address}`)
  }

  getKanbanStats() : Observable<KanbanStats>{
    return this.http.get<KanbanStats>(`${this.tmpUrl}getkanbanstats`)
  }

  getLaetstOrders() : Observable<Order[]>{
    return this.http.get<Order[]>(`${this.tmpUrl}getlatestorders`)
  }

  getLatestTrades() : Observable<Trade[]>{
    return this.http.get<Trade[]>(`${this.tmpUrl}getlatesttrades`)

  }

  async validateInputAndSetRoute(val: string) {
    if (val.length < 10) {
      //most likely blocknumber
      this.router.navigate(['/block-detail/' + val])
    } else if (val.length > 10 && val.length < 50) {
      //most likely address
      this.router.navigate(['/address-detail/' + val])

    } else {
      //assume transaction hash - temporary solution
      this.router.navigate([`/tx-detail/${val}`])

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
    //TODO check for orderhash, withdrawal requests etc.


    // return this.http.get<Transaction>("${this.url}kanban/explorer/gettransaction/" + val)
  }
}
