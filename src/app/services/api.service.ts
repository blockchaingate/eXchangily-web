import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Balance, EthBalance, FabTransaction, BtcTransaction, EthTransaction
    , FabTransactionResponse, CoinsPrice, BtcUtxo, KEthBalance, FabUtxo, FabTransactionJson, BtcTransactionResponse} from '../interfaces/balance.interface';


@Injectable() 
export class ApiService {
    endpoint = 'http://169.45.42.108:4000';
   
    constructor(private http: HttpClient) { }
    post (path: string, data: any) {
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-cache'
       });   
       const options = {
        headers: httpHeaders
        };           
        path = this.endpoint + path;
        return this.http.post(path, data, options);
    }
    get (path: string) {
        path = this.endpoint + path;
        return this.http.get(path);
    }
    
    async getCoinsPrice() {
        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,fabcoin,tether&vs_currencies=usd';
        const response = await this.http.get(url).toPromise() as CoinsPrice;  
        return response;        
    }

    async getBtcUtxos(address: string): Promise<[BtcUtxo]> {
        const url = 'http://18.188.32.168:8000/getutxos/' + address;
        console.log('url in getBtcUtxos' + url);
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }
    
    async getBtcBalance(address: string): Promise<Balance> {
        /*
        let balance = 0;
        try {
            const utxos = await this.getBtcUtxos(address);
            if (utxos && utxos.length > 0) {
                for (let i = 0; i < utxos.length; i++) {
                    balance += utxos[i].value;
                }
            }
        } catch (e) { console.log(e); }
        */
        const url = 'http://18.188.32.168:8000/getbalance/' + address;
        console.log('url for getBtcBalance=' + url);
        let balance = 0;
        try {
            const response = await this.http.get(url).toPromise() as number;
            balance = response;
        } catch (e) {console.log (e); }
        console.log('balance=' + balance);
        const lockbalance = 0;
        return {balance, lockbalance};

        /*
        let balance = 0;
        const url = 'https://api.blockcypher.com/v1/btc/test3/addrs/' + address + '?token=062d147ef3bc412688fedcaadb1b13c4';
        try {
            const response = await this.http.get(url).toPromise() as Balance; 
            balance = response.balance;
        } catch (e) {

        }

        return balance;
        */

    }

    async isFabTransactionLocked(txid: string): Promise<boolean> {
        
        const url = 'http://52.60.97.159:8000/gettransactionjson/' + txid;
        const response = await this.http.get(url).toPromise() as FabTransactionJson;

        if (response.vin && response.vin.length > 0) {
            const vin = response.vin[0];
            if (vin.coinbase) {
                if (response.confirmations <= 800) {
                    return true;
                }
            }
        }
        return false;
    }

    async getFabTransaction(address: string): Promise<FabTransaction> {
        const url = 'https://fabtest.info/utxo-api/transactions?address=' + address;
        const response = await this.http.get(url).toPromise() as FabTransaction;
        return response;
    }

    async getFabUtxos(address: string): Promise<[FabUtxo]> {
        const url = 'http://52.60.97.159:8000/getutxos/' + address;
        const response = await this.http.get(url).toPromise() as [FabUtxo];
        return response;
    }
    async getFabBalance(address: string): Promise<Balance> {
        /*
        const tran = await this.getFabTransaction(address);
        let balance = 0;
        for (let i = 0; i < tran.result.length; i++) {
            const utxos = tran.result[i].utxos;
            for (let j = 0; j < utxos.length; j++) {
                balance += utxos[j].value;
            }
        }
        return balance;
        */

        /*
       let balance = 0;
       const url = 'http://52.60.97.159:8000/getbalance/' + address;
       try {
        console.log('fafweaf');
            const response = await this.http.get(url).toPromise() as string;
            console.log('balance1=' + balance);
            balance = Number(response);
            console.log('balance=' + balance);
       } catch (e) {
            console.log('eeeeee', e);
       }
       return balance;       
       */
       let balance = 0;
       let lockbalance = 0;
       const utxos = await this.getFabUtxos(address);
       if (utxos) {
        for (let i = 0; i < utxos.length; i++) {
            const utxo = utxos[i];
            const value = utxo.value;
            const txid = utxo.txid;
            const isLock = await this.isFabTransactionLocked(txid);
            if (isLock) {
                lockbalance += value;
            } else {
                balance += value;
            }
        }
       }

       return {balance, lockbalance};

    }

    async getEthNonce (address: string) {
        const url = 'http://3.13.178.231:3000/getnonce/' + address;
        const response = await this.http.get(url).toPromise() as string;
        return Number (response);
    }

    async postEthTx(txHex: string) {
        //account for https://etherscan.io  keninqiu   82239^
        //token: M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB
        const url = 'https://api-ropsten.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex='
        + txHex + '&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        const response = await this.http.get(url).toPromise() as EthTransaction;
        console.log('response for postEthTx=');
        console.log(response);
        if (response && response.result) {
            return response.result;
        }
        return '';
    }

    async postFabTx(txHex: string) {
        
        const url = 'http://fabtest.info:9001/fabapi/' + '/sendrawtransaction/' + txHex;
        //new endpoint: https://fabexplorer.info:9003/fabapi/sendrawtransaction/
        //const url = 'https://fabexplorer.info:9003/fabapi/sendrawtransaction/' + txHex;
        console.log('txHex=' + txHex);
        console.log('url=' + url);
        const response = await this.http.get(url).toPromise() as FabTransactionResponse;
        console.log('response from postFabTx=');
        console.log(response);
        let ret = '';
        if (response && response.txid) {
            ret = '0x' + response.txid;
        }
        console.log('ret from postFabTx=' + ret);
        return ret;
    }

    async postBtcTx(txHex: string) {
        /*
        const url = 'https://api.blockcypher.com/v1/btc/test3' + '/txs/push';
        const response = await this.http.post(url, {tx: txHex}).toPromise() as BtcTransaction;
        let ret = '';
        console.log('response from postBtcTx=');
        console.log(response.tx);
        if (response && response.tx && response.tx.hash) {
            ret = '0x' + response.tx.hash;
        }
        return ret;
        */
       const url = 'http://18.188.32.168:8000/sendrawtransaction/' + txHex;
       console.log('weird start, url=' + url);
       const response = await this.http.get(url).toPromise() as BtcTransactionResponse;
       console.log('weird end');
       console.log(response.txid);
       return '0x' + response.txid;
    }

    async getEthBalance(address: string): Promise<Balance> {
        // account for https://etherscan.io  keninqiu   82239^
        // token: M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB
        // post https://faucet.metamask.io/ with raw data address to get some coins

        /*
        const url = 'https://api-ropsten.etherscan.io/api?module=account&action=balance&address='
        + address + '&tag=latest&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        const response = await this.http.get(url).toPromise()  as EthBalance;    
        return response.result;  
        */
       const url = 'http://3.13.178.231:3000/getbalance/' + address;
       const response = await this.http.get(url).toPromise()  as KEthBalance;    
       console.log('balance for etheeeee' + response.balance);
       const balance = response.balance;
       const lockbalance = 0;
       return {balance, lockbalance};  
    }

    async getEthTokenBalance(contractAddress: string, address: string) {
        const url = 'https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress='
        + contractAddress + '&address=' + address + '&tag=latest&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        const response = await this.http.get(url).toPromise()  as EthBalance;    
        console.log('url=' + url);
        console.log(response);
        const balance = response.result;
        const lockbalance = 0;
        return {balance, lockbalance}; 
    }
}
