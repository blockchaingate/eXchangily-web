import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BlockNumberResponse, BlockResponse, AccountsResponse, TransactionAccountResponse} from '../interfaces/kanban.interface';

@Injectable()
export class KanbanService {
//getCoinPoolAddress
//getExchangeAddress

    endpoint = 'http://169.45.42.108:4000';
   
    constructor(private http: HttpClient) { }

    async getCoinPoolAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = '/exchangily/getCoinPoolAddress';
        path = this.endpoint + path;      
        const addr = await this.http.get(path, { headers, responseType: 'text'}).toPromise() as string;
        return addr;
    }



    async getAccounts() {
        const path = '/kanban/getAccounts';
        const res = await this.get(path).toPromise() as AccountsResponse;
        return res.accounts;
    }
    async getLatestBlock() {
        //const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        const path = '/kanban/getBlockNumber';
        const res = await this.get(path).toPromise() as BlockNumberResponse;
        return res.blockNumber.blockNumber;
    }

    async getBlock(blockNumber: string) {
        const path = '/kanban/getBlock/' + blockNumber; 
        const res = await this.get(path).toPromise() as BlockResponse;
        return res;
    }

    async getTransactionCount(address: string) {
        const path = '/kanban/getTransactionCount/' + address; 
        const res = await this.get(path).toPromise() as TransactionAccountResponse;
        return res.transactionCount;
    }

    getExchangeAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = '/exchangily/getExchangeAddress';
        path = this.endpoint + path;  
        const addr = this.http.get(path, { headers, responseType: 'text'});
        return addr;
    }

    sendRawSignedTransaction(txhex: string) {
        const data = {
            signedTransactionData: txhex
        };
        return this.post('/kanban/sendRawTransaction', data);
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
        return this.get('/exchangily/getAllOrderData');
    }
}
