import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Balance, EthBalance, FabTransaction, EthTransaction, EthTransactionRes
    , FabTransactionResponse, CoinsPrice, BtcUtxo, KEthBalance, FabUtxo,
    FabTokenBalance, FabTransactionJson, BtcTransactionResponse, BtcTransaction} from '../interfaces/balance.interface';

import {Web3Service} from './web3.service';
import {UtilService} from './util.service';
import {AlertService} from './alert.service';

import { environment } from '../../environments/environment';
@Injectable() 
export class ApiService {
    
    constructor(private http: HttpClient, private web3Serv: Web3Service, private utilServ: UtilService, private alertServ: AlertService) { }
    
    async getCoinsPrice() {
        const url = environment.endpoints.coingecko + 'api/v3/simple/price?ids=bitcoin,ethereum,fabcoin,tether&vs_currencies=usd';
        const response = await this.http.get(url).toPromise() as CoinsPrice;  
        return response;        
    }

    async getBtcUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BTC.exchangily + 'getutxos/' + address;
        console.log('url in getBtcUtxos' + url);
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }
    
    async getBtcTransaction(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.BTC.exchangily + 'gettransactionjson/' + txid;
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as BtcTransaction;
            console.log('response=', response);
        } catch (e) {console.log (e); }
        return response;        
    }

    async getEthTransaction(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransaction/' + txid;
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as EthTransactionRes;
        } catch (e) {console.log (e); }
        return response; 
    }

    async getBtcBalance(address: string): Promise<Balance> {
        const url = environment.endpoints.BTC.exchangily + 'getbalance/' + address;
        let balance = 0;
        try {
            const response = await this.http.get(url).toPromise() as number;
            balance = response;
        } catch (e) {console.log (e); }
        const lockbalance = 0;
        return {balance, lockbalance};
    }

    async getFabTransactionJson(txid: string): Promise<FabTransactionJson> {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.FAB.exchangily + 'gettransactionjson/' + txid;
        const response = await this.http.get(url).toPromise() as FabTransactionJson;
        return response;
    }
    async isFabTransactionLocked(txid: string): Promise<boolean> {
        
        const response = await this.getFabTransactionJson(txid);

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

    async getFabUtxos(address: string): Promise<[FabUtxo]> {
        const url = environment.endpoints.FAB.exchangily + 'getutxos/' + address;
        const response = await this.http.get(url).toPromise() as [FabUtxo];
        return response;
    }
    async getFabBalance(address: string): Promise<Balance> {

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
        const url = environment.endpoints.ETH.exchangily + 'getnonce/' + address + '/latest';
        const response = await this.http.get(url).toPromise() as string;
        return Number (response);
    }

    async postEthTx(txHex: string) {
        console.log('postEthTx here we go');
        // account for https://etherscan.io  keninqiu   82239^
        // token: M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB

        /*
        const url = environment.endpoints.ETH.etherscan + 'api?module=proxy&action=eth_sendRawTransaction&hex='
        + txHex + '&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        let response = null;
        if (txHex) {
            response = await this.http.get(url).toPromise() as EthTransaction;
        }
        console.log('response for postEthTx=');
        console.log(response);
        if (response) {
            if (response.result) {
                return response.result;
            }
            if (response.error && response.error.message) {
                this.alertServ.openSnackBar(response.error.message, 'Ok');
            }
        }
        */
        const url = environment.endpoints.ETH.exchangily + 'sendsignedtransaction';
        const data = {
            signedtx: txHex
        };
        let response = null;
        if (txHex) {
            response = await this.http.post(url, data, {responseType: 'text'}).toPromise() as string;
        }        
        if (response) {
            console.log('response=', response);
            return response;
        }
        return '';
    }

    async postFabTx(txHex: string) {
        
        const url = 'http://fabtest.info:9001/fabapi/' + '/sendrawtransaction/' + txHex;
        console.log('txHex=' + txHex);
        console.log('url=' + url);
        let response = null;
        if (txHex) {
            response = await this.http.get(url).toPromise() as FabTransactionResponse;
        }
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

       const url = environment.endpoints.BTC.exchangily + 'sendrawtransaction/' + txHex;
       console.log('weird start, url=' + url);
       let response = null;
       if (txHex) {
           response = await this.http.get(url).toPromise() as BtcTransactionResponse;
       }
       console.log('weird end');
       console.log(response.txid);
       return '0x' + response.txid;
    }

    async getEthBalance(address: string): Promise<Balance> {
       const url = environment.endpoints.ETH.exchangily + 'getbalance/' + address;
       const response = await this.http.get(url).toPromise()  as KEthBalance;
       const balance = response.balance;
       const lockbalance = 0;
       return {balance, lockbalance};  
    }

    async getEthTokenBalance(contractAddress: string, address: string) {
        const url = environment.endpoints.ETH.etherscan + 'api?module=account&action=tokenbalance&contractaddress='
        + contractAddress + '&address=' + address + '&tag=latest&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        console.log('url for getEthTokenBalance=' + url);
        const response = await this.http.get(url).toPromise()  as EthBalance;
        const balance = response.result;
        const lockbalance = 0;
        return {balance, lockbalance}; 
    }

    async fabCallContract(contractAddress: string, fxnCallHex: string) {
        const url = environment.endpoints.FAB.exchangily + 'callcontract';

        contractAddress = this.utilServ.stripHexPrefix(contractAddress);     
        const data = {address: contractAddress, data: fxnCallHex};

        const formData: FormData = new FormData(); 
        formData.append('address', contractAddress); 
        formData.append('data', fxnCallHex); 

        const response = await this.http.post(url, formData).toPromise() as FabTokenBalance;
        return response;
    }

    async getFabTokenBalance(contractAddress: string, address: string) {
        
        console.log('contractAddress=' + contractAddress + ',address=' + address);
        let fxnCallHex = this.web3Serv.getFabBalanceOfABI([address]);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);

        let response = await this.fabCallContract(contractAddress, fxnCallHex);

        let balanceHex = response.executionResult.output;
        const balance = parseInt(balanceHex, 16);


        fxnCallHex = this.web3Serv.getFabFrozenBalanceABI([address]);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);
        response = await this.fabCallContract(contractAddress, fxnCallHex);
        balanceHex = response.executionResult.output;
        console.log('response here we go:', response);
        let lockbalance = 0;
        if (balanceHex) {
            lockbalance = parseInt(balanceHex, 16);
        }
        return {balance, lockbalance};
    }
}
