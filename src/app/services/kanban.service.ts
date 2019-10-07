import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BlockNumberResponse, BlockResponse, AccountsResponse,TransactionsResponse,
    KanbanGetBanalceResponse, TransactionAccountResponse, Block} from '../interfaces/kanban.interface';
import { environment } from '../../environments/environment';
@Injectable()
export class KanbanService {
// getCoinPoolAddress
// getExchangeAddress

    endpoint = environment.endpoints.kanban;
   
    constructor(private http: HttpClient) { }

    async getCoinPoolAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'exchangily/getCoinPoolAddress';
        path = this.endpoint + path;
        let addr = '';
        try {
            addr = await this.http.get(path, { headers, responseType: 'text'}).toPromise() as string;
        } catch (e) {
        }
        
        return addr;
    }

    async getAccounts() {
        const path = 'kanban/getAccounts';
        const res = await this.get(path).toPromise() as AccountsResponse;
        return res.accounts;
    }

    getBlock(blockNumber: string) {
        const path = 'kanban/getBlock/' + blockNumber; 
        console.log('path for getBlock=' + path);
        const res = this.get(path);
        return res;
    }

    getLatestBlocks() {
        const path = environment.endpoints.explorer + 'getlatestblocks/10';
        const res = this.http.get(path);
        return res;
    }

    getBlocks(blockNum: number, num: number) {
        const path = environment.endpoints.explorer + 'getblocks/' + blockNum + '/' + num;
        const res = this.http.get(path);
        return res;
    }

    getLatestTransactions(block: string, address: string, num: number) {
        let path = '';
        if (block) {

        } else
        if (address) {
            path = environment.endpoints.explorer + 'getaddresstxsall/' + address;

        } else {
            path = environment.endpoints.explorer + 'transactions/' + num;
        }
        
        console.log('path in getLatestTransactions=' + path);
        const res = this.http.get(path);
        return res;
    }
    
    getTransactions(blockNum: number, num: number) {
        const path = environment.endpoints.explorer + 'transactions/' + blockNum + '/' + num;
        const res = this.http.get(path);
        return res;
    }

    
    async getTransactionCount(address: string) {
        const path = 'kanban/getTransactionCount/' + address; 
        console.log('nouse in here:', path);
        const res = await this.get(path).toPromise() as TransactionAccountResponse;
        return res.transactionCount;
    }

    async getExchangeAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'exchangily/getExchangeAddress';
        path = this.endpoint + path;  
        const addr = await this.http.get(path, { headers, responseType: 'text'}).toPromise() as string;
        return addr;
    }

    async getScarAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'kanban/getScarAddress';
        path = this.endpoint + path;  
        const addr = await this.http.get(path, { headers, responseType: 'text'}).toPromise() as string;
        return addr;
    }

    sendRawSignedTransaction(txhex: string) {
        const data = {
            signedTransactionData: txhex
        };
        return this.post('kanban/sendRawTransaction', data);
    }

    submitDeposit(rawTransaction: string, rawKanbanTransaction: string) {
        const data = {
            'rawTransaction': rawTransaction,
            'rawKanbanTransaction': rawKanbanTransaction
        };
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-cache'
       });   
       const options = {
        headers: httpHeaders
        };    
        console.log('data for submitDeposit=', data);       
        const path = this.endpoint + 'submitDeposit';
        return this.http.post(path, data, options);        
    }

    getBalance(address: string) {
        const url = 'exchangily/getBalances/' + address;
        console.log('url=' + url);
        return this.get(url);
    }

    async getGas(address: string) {
        const path = 'kanban/getBalance/' + address;
        
        let gas = 0;
        try {
            const ret = await this.get(path).toPromise() as KanbanGetBanalceResponse;
            gas = Number(BigInt(ret.balance.FAB).toString(10)) / 1e18;
        } catch (e) {}
        return gas;
    }
    post (path: string, data: any) {
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-cache'
       });   
       const options = {
        headers: httpHeaders
        };           
        path = this.endpoint + path;
        console.log('path=' + path);
        console.log(data);
        return this.http.post(path, data, options);
    }
    get (path: string) {
        path = this.endpoint + path;
        return this.http.get(path);
    }

    getAllOrders() {
        return this.get('exchangily/getAllOrderData');
    }
}
