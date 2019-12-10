import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BlockNumberResponse, BlockResponse, AccountsResponse, TransactionsResponse,
    KanbanGetBanalceResponse, TransactionAccountResponse, DepositStatusResp} from '../interfaces/kanban.interface';
import { environment } from '../../environments/environment';
import { UtilService } from './util.service';
import {TransactionReceiptResp} from '../interfaces/kanban.interface';
@Injectable()
export class KanbanService {
// getCoinPoolAddress
// getExchangeAddress

    endpoint = environment.endpoints.kanban;
   
    constructor(private http: HttpClient, private utilServ: UtilService) { }

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

    getAccounts() {
        const path = 'kanban/getAccounts';
        const res = this.get(path);
        return res;
    }

    getBlock(blockNumber: string) {
        const path = 'kanban/getBlock/' + blockNumber; 
        console.log('path for getBlock=' + path);
        const res = this.get(path);
        return res;
    }

    getLatestBlocks() {
        const path = environment.endpoints.kanban + 'kanban/explorer/getlatestblocks/10';
        const res = this.http.get(path);
        return res;
    }

    getBlocks(blockNum: number, num: number) {
        const path = environment.endpoints.kanban + 'kanban/explorer/getblocks/' + blockNum + '/' + num;
        const res = this.http.get(path);
        return res;
    }

    getLatestTransactions(block: string, address: string, num: number) {
        let path = '';
        if (block) {

        } else
        if (address) {
            path = environment.endpoints.kanban + 'kanban/explorer/getaddresstxsall/' + address;

        } else {
            path = environment.endpoints.kanban + 'kanban/explorer/transactions/' + num;
        }
        
        console.log('path in getLatestTransactions=' + path);
        const res = this.http.get(path);
        return res;
    }
    
    getTransactions(blockNum: number, num: number) {
        const path = environment.endpoints.kanban + 'kanban/explorer/transactions/' + blockNum + '/' + num;
        const res = this.http.get(path);
        return res;
    }

    
    async getTransactionCount(address: string) {
        const path = 'kanban/getTransactionCount/' + address; 
        console.log('nouse in here:', path);
        const res = await this.get(path).toPromise() as TransactionAccountResponse;
        return res.transactionCount;
    }

    getOrdersByAddress(address: string) {
        let path = 'ordersbyaddress/' + address;
        path = environment.endpoints.kanban + path;
        console.log('path for getOrdersByAddress=' + path);
        const res = this.http.get(path);
        return res;
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

    submitReDeposit(rawKanbanTransaction: string) {
        const data = {
            'rawKanbanTransaction': rawKanbanTransaction
        };
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-cache'
       });   
       const options = {
        headers: httpHeaders
        };    
        console.log('data for resubmitDeposit=', data);       
        const path = this.endpoint + 'resubmitDeposit';
        return this.http.post(path, data, options);
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
        return this.get(url);
    }

    async getGas(address: string) {
        const path = 'kanban/getBalance/' + address;
        console.log('path2=' + path);
        let gas = 0;
        try {
            const ret = await this.get(path).toPromise() as KanbanGetBanalceResponse;
            //gas = Number(BigInt(ret.balance.FAB).toString(10)) / 1e18;

            const fab = this.utilServ.stripHexPrefix(ret.balance.FAB);
            gas = this.utilServ.hexToDec(fab) / 1e18;            
        } catch (e) {}
        return gas;
    }

    getKanbanBalance(address: string) {
        const path = 'kanban/getBalance/' + address;
        console.log('path1=' + path);
        return this.get(path);
    }

    getDepositErr(address: string) {
        const path = 'depositerr/' + address;
        console.log('path1=' + path);
        return this.get(path);
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

    async getDepositStatus(txid: string) {
        let response = null;
        let status = 'pending';   
        if (!txid) {
            return 'undefined';
        }
        try {
            response = await this.get('checkstatus/' + txid).toPromise() as DepositStatusResp;
            if (response && response.code) {
                if (response.code === 0) {
                    status = 'confirmed';
                } else 
                if (response.code === 2) {
                    status = 'failed';
                } else
                if (response.code === 3) {
                    status = 'claim';
                }
            }

        } catch (e) {console.log (e); }        
        return status; 
    }

    async getTransactionStatus(txid: string) {
        let response = null;
        let status = 'failed';
        try {
            response = await this.get('kanban/getTransactionReceipt/' + txid).toPromise() as TransactionReceiptResp;
            console.log('response.transactionReceipt=', response.transactionReceipt);
            console.log('response.transactionReceipt.status=', response.transactionReceipt.status);
            if (response && response.transactionReceipt && response.transactionReceipt.status === '0x1') {
                status = 'confirmed';
            }
        } catch (e) {console.log (e); }

        return status;         
    }   
    
    getTransactionStatusSync(txid: string) {
        return this.get('kanban/getTransactionReceipt/' + txid);
    }

    getDepositStatusSync(txid: string) {
        return this.get('checkstatus/' + txid);
    }
}
