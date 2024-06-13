import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import {Balance,  EthTransactionRes
    , FabTransactionResponse, CoinsPrice, BtcUtxo, KEthBalance, FabUtxo, EthTransactionStatusRes, GasPrice,
    FabTokenBalance, FabTransactionJson, BtcTransactionResponse, BtcTransaction, JsonResult} from '../interfaces/balance.interface';

import {Web3Service} from './web3.service';
import {UtilService} from './util.service';
import {AlertService} from './alert.service';
import BigNumber from 'bignumber.js';
import { environment } from '../../environments/environment';
import TronWeb from 'tronweb';
import { Observable } from 'rxjs';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(environment.chains.TRX.fullNode);
const solidityNode = new HttpProvider(environment.chains.TRX.solidityNode);
const eventServer = new HttpProvider(environment.chains.TRX.eventServer);
const ADDRESS_PREFIX_REGEX = /^(41)/;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer
);

@Injectable() 
export class ApiService {
    
    constructor(private http: HttpClient, private web3Serv: Web3Service, private utilServ: UtilService, private alertServ: AlertService) { }
    
    getExchangilyCreateOrders(pageSize: number, pageNum: number) {
        const observable = new Observable((subscriber) => {
            const url = environment.endpoints.api + 'v3/exchangily/createOrder/' + pageSize + '/' + pageNum;

            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            subscriber.next(data);
                        }
                    }
                }
            );
        });
        return observable;
    }

    getExchangilyCreateOrdersTotalCount() {
        const observable = new Observable((subscriber) => {
            const url = environment.endpoints.api + 'v3/exchangily/createOrder/totalCount';

            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            subscriber.next(data);
                        }
                    }
                }
            );
        });
        return observable;
    }

    getExchangilyCancelledOrders(pageSize: number, pageNum: number) {
        const observable = new Observable((subscriber) => {
            const url = environment.endpoints.api + 'v3/exchangily/createOrder/cancelled/' + pageSize + '/' + pageNum;

            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            subscriber.next(data);
                        }
                    }
                }
            );
        });
        return observable;
    }

    getExchangilyCancelledOrdersTotalCount() {
        const observable = new Observable((subscriber) => {
            const url = environment.endpoints.api + 'v3/exchangily/createOrder/cancelled/totalCount';

            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            subscriber.next(data);
                        }
                    }
                }
            );
        });
        return observable;
    }

    getKanbanTokens() {
        const observable = new Observable((subscriber) => {
            const url = environment.endpoints.api + 'v3/token/erc20/1000/0';

            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            subscriber.next(data);
                        }
                    }
                }
            );
        });
        return observable;
    }

    claimWithdraw(rawtxs: any) {
        const observable = new Observable((subscriber) => {
            const url = environment.endpoints.api + 'v3/bridge/claimWithdraw';
            const data = {
                rawtxs
            };
            this.http.post(url, data).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            subscriber.next(data);
                        }
                    }
                }
            );
        });
        return observable;
    }

    withdrawFee(srcChain: string) {
        const url = environment.endpoints.api + 'v3/bridge/withdrawFee';
        const data = {
            srcChain
        };
        return this.http.post(url, data);
    }

    withdrawQuote(address: string, recipient:string, destId: string,  srcChain: string,  amount: number) {
        const url = environment.endpoints.api + 'v3/bridge/withdrawQuote';
        const data = {
            address,
            recipient,
            destId,
            srcChain,
            amount
        };
        return this.http.post(url, data);
    }

    async getPairDecimals(pairName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const url = environment.endpoints.api + 'v3/exchangily/pair/' + pairName + '/decimals';

            console.log('url===', url);
            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        console.log('ret for getPairDecimals===', ret);
                        if(ret.success) {
                            const data = ret.data;
                            resolve(data);
                        } else {
                            resolve(null);
                        }

                    }
                }
            );
        });

    }

    async getPair(symbol: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const url = environment.endpoints.api + 'v3/exchangily/pair/' + symbol;

            console.log('url===', url);
            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            resolve(data);
                        } else {
                            resolve(null);
                        }

                    }
                }
            );
          });

    }

    async getTsWalletBalance(chain: string, tokenId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const url = environment.endpoints.api + 'v3/bridge/tsWalletBalance/' + chain + '/' + tokenId;

            this.http.get(url).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            resolve(data);
                        }
                    }
                }
            );
          });

    }
    async getTSWalletAddress(chain: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const url = environment.endpoints.api + 'v3/bridge/tsWalletAddress';
            const data = {
                chain
            };
            this.http.post(url, data).subscribe(
                {
                    next: (ret: any) => {
                        if(ret.success) {
                            const data = ret.data;
                            resolve(data);
                        }
                    }
                }
            );
          });

    }

    getExTransaction(code: string) {
        const url = environment.endpoints.blockchaingate + 'payment/gateway/code/' + code;
        return this.http.get(url);
    }

    getFabBlockHeight() {
        const url = environment.endpoints.FAB.exchangily + 'getblockcount';
        return this.http.get(url);
    }
    async getTrxTransactionStatus(txid: string) {
        const transactionInfo = await tronWeb.trx.getTransactionInfo(txid);
        if(transactionInfo && transactionInfo.receipt) {
            if(transactionInfo.receipt.result == 'SUCCESS') {
                return 'confirmed';
            } 
            return 'failed';
        }
        return 'pending';
    }

    async getBnbTransactionStatus(txid: string) {
        const url = environment.chains.BNB.rpcEndpoint;

        let status = '';
        try {
            const data = {
                "jsonrpc":"2.0",
                "method":"eth_getTransactionReceipt",
                "params":[
                    txid
                ],
                "id":1
            };
            const response = await this.http.post(url, data).toPromise() as JsonResult;
            const receipt = response.result;
            if(!receipt) {
                return status;
            }
            const receiptStatus = receipt.status;
            if(receiptStatus == '0x1') {
                status = 'confirmed';
            } else
            if(receiptStatus == '0x0') {
                status = 'failed';
            }

        } catch (e) {console.log (e); }
        return status;
    }

    getOrderByCode(code: string) {

        const url = environment.endpoints.blockchaingate + 'orders/code/' + code;
        return this.http.get(url);
    }
    
    getEXGLockerDetail(fabAddress: string) {
        const url = environment.endpoints.kanban + 'getLockerHashesByAccount/' + fabAddress;
        return this.http.get(url);
    }

    issueToken(data) {
        console.log('data===', data);
        
        const url = environment.endpoints.blockchaingate + 'issuetoken/Create' ;

        console.log('url===', url);
        return this.http.post(url, data);
    }
    
    updateIssueToken(data) {
        const url = environment.endpoints.blockchaingate + 'issuetoken/Update' ;
        return this.http.post(url, data);
    }

    oin(symbol: string) {
        const url = environment.endpoints.kanban + 'coins/' + symbol;
        return this.http.get(url);
    }

    getIssueTokens() {
        const url = environment.endpoints.blockchaingate + 'issuetoken' ;
        return this.http.get(url);
    }
    getIssueTokensOwnedBy(address: string) {
        const url = environment.endpoints.blockchaingate + 'issuetoken/ownedBy/' + address ;
        return this.http.get(url);
    }
    async getIssueToken(tokenId: string) {
        const url = environment.endpoints.blockchaingate + 'issuetoken/' +  tokenId;
        return await this.http.get(url).toPromise();
    }
    getAllCoins() {
        const url = environment.endpoints.kanban + 'coins/';
        return this.http.get(url).toPromise();
    }

    getEpayHash(paymentAmount: number, paymentUnit: string) {
        const url = environment.endpoints.blockchaingate + 'epay/hash/' + paymentAmount + '/' + paymentUnit;
        return this.http.get(url);       
    }
    /// hash/:payeeAccount/:paymentAmount/:paymentUnit
    chargeOrder(orderID, txhex: string) {
        const url = environment.endpoints.blockchaingate + 'orders/' + orderID + '/charge' ;

        const data = {
            rawTransaction: txhex
        };   
        
        return this.http.post(url, data);
    }

    updateExTransactionId(trans_code: string, txid: string) {
        const url = environment.endpoints.blockchaingate + 'payment/gateway/transaction';
        const data = {
            trans_code: trans_code,
            txid: txid
        };
        return this.http.post(url, data);
    }

    

    getSmartContractABI(address: string) {
        if (!address.startsWith('0x')) {
            address = '0x' + address;
        }
        if(
            (address == environment.addresses.smartContract.DSC.FAB)
            || (address == environment.addresses.smartContract.BST.FAB)
        ) {
            address = environment.addresses.smartContract.EXG.FAB;
        }
        let url = environment.endpoints.FAB.exchangily + 'getabiforcontract/' + address; 
        /*
        if(address == environment.addresses.smartContract.EXG.FAB) {
            url = 'https://fabprod.fabcoinapi.com/' + 'getabiforcontract/' + '0xa3e26671a38978e8204b8a37f1c2897042783b00'; 
        }
        */
        return this.http.get(url);
    }
    async getCoinsPrice() {
        const url = environment.endpoints.coingecko + 'api/v3/simple/price?ids=bitcoin,ethereum,fabcoin,tether&vs_currencies=usd';
        const response = await this.http.get(url).toPromise() as CoinsPrice;  
        return response;        
    }

    getUSDValues() {
        const url = 'https://kanbanprod.fabcoinapi.com/getexgprice';
        return this.http.get(url);
    }
    
    getBtcTransFeeEstimate() {
        const url = environment.endpoints.BTC.exchangily + 'getfeeestimate';
        return this.http.get(url);
    }

    async getBtcUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BTC.exchangily + 'getutxos/' + address;
        console.log('url in getBtcUtxos' + url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async getUtxos(coin: string, address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints[coin].exchangily + 'getutxos/' + address;
        
        console.log('url in getBtcUtxos' + url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async getBchUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BCH.exchangily + 'getutxos/' + address;
        console.log('url in getBchUtxos' + url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async getEthereumCompatibleTokenBalance(chainName: string, smartContractAddress: string, address: string) {
        const url = environment.chains[chainName].rpcEndpoint;

        if(address.indexOf('0x') == 0) {
            address = address.substring(2);
        }
        let balance = '';
        try {
            const dataParam = '0x70a08231'
            + '000000000000000000000000'
            + address;
            const data = {
                "jsonrpc":"2.0",
                "method":"eth_call",
                "params":[
                    {
                        "to": smartContractAddress, 
                        "data": dataParam
                    }, 
                    "latest"
                ],
                "id":1
            };
            const response = await this.http.post(url, data).toPromise() as JsonResult;
            
            balance = response.result;
        } catch (e) {console.log (e); }
        return balance;

    }

    async getEthGasPrice(): Promise<number> {
        const url = 'https://ethprod.fabcoinapi.com/getgasprice';
        let gasPrice = 0;
        try {
            const response = await this.http.get(url).toPromise() as GasPrice;
            gasPrice = response.gasprice;
        } catch (e) {console.log (e); }
        return gasPrice;
    }

    async getEtheruemCompatibleGasPrice(coinName: string) : Promise<number> {
        const url = environment.chains[coinName].rpcEndpoint;
        let gasPrice = 0;
        try {

            const data = {"jsonrpc":"2.0","method":"eth_gasPrice","params": [],"id":1};
            const response = await this.http.post(url, data).toPromise() as JsonResult;
            
            gasPrice = new BigNumber(response.result, 16).toNumber();
        } catch (e) {console.log (e); }
        return gasPrice;
    }

    async getEtheruemCompatibleDecimals(chain: string, smartContractAddress: string) : Promise<number> {
        const abi = {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
              }
            ],
            "payable": false,
            "type": "function"
        };
        const args = [];
        const abiHex = this.web3Serv.getGeneralFunctionABI(abi, args);
        console.log('abiHex===', abiHex);
        const result = await this.getEtheruemCompatibleEthCall(chain, smartContractAddress, abiHex);
        const decimals = parseInt(result, 16);
        return decimals;
    }


    async getEtheruemCompatibleName(chain: string, smartContractAddress: string) : Promise<string> {
        const abi = {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        };
        const args = [];
        const abiHex = this.web3Serv.getGeneralFunctionABI(abi, args);
    
        const result = await this.getEtheruemCompatibleEthCall(chain, smartContractAddress, abiHex);
        const name =this.web3Serv.toAscii(result);
        console.log('result for name=====', name);
        return name;
    }
  
    async getEtheruemCompatibleSymbol(chain: string, smartContractAddress: string) : Promise<string> {
        const abi = {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
              {
                "name": "",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          };
        const args = [];
        const abiHex = this.web3Serv.getGeneralFunctionABI(abi, args);
    
        const result = await this.getEtheruemCompatibleEthCall(chain, smartContractAddress, abiHex);

        const symbol =this.web3Serv.toAscii(result);
        console.log('result for symbol=====', symbol);

        return symbol;
    }    

    async getEtheruemCompatibleEthCall(chain: string, smartContractAddress: string, dataParam: string) : Promise<string> {
        let result = '';

        if(chain == 'ETH') {
            const url = 'https://eth' + (environment.production ? 'prod' : 'test') + '.fabcoinapi.com/call';
            const data = {
                transactionOptions: {
                    to: smartContractAddress,
                    data: dataParam
                }
            };
            const response = await this.http.post(url, data).toPromise() as JsonResult;
            console.log('response from ETH ====', response);
            result = response.result;

        } if(chain == 'TRX') {
            const url = environment.chains[chain].fullNode;
            console.log('dataParam===', dataParam);
            try {
                const data = {
                    "jsonrpc":"2.0",
                    "method":"eth_call",
                    "params":[
                        {
                            "to": smartContractAddress, 
                            "data": dataParam
                        }, 
                        "latest"
                    ],
                    "id":1
                };
                const response = await this.http.post(url, data).toPromise() as JsonResult;
                console.log('response===', response);
                result = response.result;
            } catch (e) {console.log (e); }
        }
        else {
            const url = environment.chains[chain].rpcEndpoint;

            try {
                const data = {
                    "jsonrpc":"2.0",
                    "method":"eth_call",
                    "params":[
                        {
                            "to": smartContractAddress, 
                            "data": dataParam
                        }, 
                        "latest"
                    ],
                    "id":1
                };
                const response = await this.http.post(url, data).toPromise() as JsonResult;
                
                result = response.result;
            } catch (e) {console.log (e); }
        }

        return result;
    }    

    async getDogeUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.DOGE.exchangily + 'getutxos/' + address;
        console.log('url for getDogeUtxos=', url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async getLtcUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.LTC.exchangily + 'getutxos/' + address;
        console.log('url for getLtcUtxos=', url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async getBtcTransaction(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.BTC.exchangily + 'gettransactionjson/' + txid;
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as BtcTransaction;
            console.log('response=', response);
        } catch (e) {console.log (e); }
        return response;        
    }

    getBtcTransactionSync(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.BTC.exchangily + 'gettransactionjson/' + txid;
        return this.http.get(url);        
    }
    async getEthTransaction(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransaction/' + txid;
        // console.log('url=' + url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as EthTransactionRes;
        } catch (e) {console.log (e); }
        return response; 
    }

    getEthTransactionSync(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransaction/' + txid;
        return this.http.get(url);
    }

    async getEthTransactionStatus(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransactionstatus/' + txid;
        console.log('url=' + url);
        let response: any = null;
        try {
            response = await this.http.get(url).toPromise() as EthTransactionStatusRes;
        } catch (e) {console.log (e); }
        return response;         
    }

    getEthTransactionStatusSync(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransactionstatus/' + txid;
        return this.http.get(url);
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

    getFabTransactionJsonSync(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.FAB.exchangily + 'gettransactionjson/' + txid;
        return this.http.get(url);
    }

    async isFabTransactionLocked(txid: string, idx: number): Promise<boolean> {
        
        const response = await this.getFabTransactionJson(txid);
        // console.log('response in isFabTransactionLocked=', response);
        if (response.vin && response.vin.length > 0) {
            const vin = response.vin[0];
            // console.log('vin=', vin);
            // console.log('idx=', idx);
            if (idx === 0 && vin.coinbase) {
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
            const idx = utxo.idx;
            /*
            const isLock = await this.isFabTransactionLocked(txid, idx);
            if (isLock) {
                lockbalance += value;
            } else {
                balance += value;
            }
            */
           balance += value;
        }
       }

       lockbalance = await this.getFabLockBalance(address);
       // console.log('balance=', balance);
       // console.log('lockbalance=', lockbalance);
       return {balance, lockbalance};

    }

    async getEthNonce (address: string) {
        const url = environment.endpoints.ETH.exchangily + 'getnonce/' + address + '/latest';
        const response = await this.http.get(url).toPromise() as string;
        return Number (response);
    }

    async getEtheruemCampatibleNonce (coinName: string, address: string) {
        const url = environment.chains[coinName].rpcEndpoint;
        const data = {
            "method":
            "eth_getTransactionCount",
            "params":[address, "latest"],
            "id":1,
            "jsonrpc":"2.0"
        };
        const response = await this.http.post(url, data).toPromise() as JsonResult;
        const result = response.result;
        return parseInt (result, 16);
    }

    async postEthTx(txHex: string) {

        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.ETH.exchangily + 'sendsignedtransaction';
        const data = {
            signedtx: txHex
        };
        if (txHex) {
            try {
                txHash = await this.http.post(url, data, {responseType: 'text'}).toPromise() as string;
            } catch (err: any) {
                console.log('errqqq=', err);
                if (err.error) {
                 errMsg = err.error;
                }
 
            }          
        }    

        return {txHash, errMsg};
    }

    async postEtheruemCompatibleTx(coinName: string, txHex: string) {

        let txHash = '';
        let errMsg = '';
        const url = environment.chains[coinName].rpcEndpoint;
        const data = {
            "jsonrpc":"2.0",
            "method":"eth_sendRawTransaction",
            "params":[txHex],
            "id":1
        };
        if (txHex) {
            try {
                const result = await this.http.post(url, data).toPromise() as JsonResult;
                if(result) {
                    txHash = result.result;
                }
            } catch (err: any) {
                if (err.error) {
                 errMsg = err.error;
                }
            }          
        }    

        return {txHash, errMsg};
    }

    async getFabLockBalance(address: string) {
        const fabSmartContractAddress = environment.addresses.smartContract.FABLOCK;
        const getLockedInfoABI = '43eb7b44';
        const url = environment.endpoints.FAB.exchangily + 'callcontract';
        const data = {
            address: this.utilServ.stripHexPrefix(fabSmartContractAddress),
            data: this.utilServ.stripHexPrefix(getLockedInfoABI),
            sender: address
        };  
        const response = await this.http.post(url, data, {responseType: 'text'}).toPromise() as string;
        const json = JSON.parse(response);
        let balance = 0;
        if (json && json.executionResult && json.executionResult.output) {
            const balanceHex = json.executionResult.output;
            // console.log('balanceHex=', balanceHex);
            const decoded = this.web3Serv.decodeParameters(['uint256[]','uint256[]'], balanceHex);
            // console.log('decoded', decoded);
            // console.log('decoded.1', decoded[1]);
            if (decoded && decoded[1]) {
                // console.log('got it,decoded[1.length=', decoded[1].length);
                for (let i = 0; i < decoded[1].length; i++) {
                    const value = decoded[1][i];
                    balance += Number(value);
                }
            }
        }
        return balance;
    }
    callFabSmartContract(address: string, abiHex: string, sender: string) {
        const url = environment.endpoints.FAB.exchangily + 'callcontract';
        const data = {
            address: address,
            data: abiHex,
            sender: sender
        };   
        return this.http.post(url, data);     
    }

    async postFabTx(txHex: string) {
        
        /*
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
        */
       const url = environment.endpoints.FAB.exchangily + 'postrawtransaction';

       // console.log('url here we go:', url);
       let txHash = '';
       let errMsg = '';
       const data = {
        rawtx: txHex
       };
       if (txHex) {
           try {
            const json = await this.http.post(url, data).toPromise() as FabTransactionResponse;
            if (json) {
                if (json.txid) {
                    txHash = json.txid;
                } else 
                if (json.Error) {
                    errMsg = json.Error;
                } 
            }
           } catch (err: any) {
               if (err.error && err.error.Error) {
                errMsg = err.error.Error;
                console.log('err there we go', err.error.Error);
               }

           }

       }       

       return {txHash, errMsg};
    }

    async postBtcTx(txHex: string) {
       let txHash = '';
       let errMsg = '';
       const url = environment.endpoints.BTC.exchangily + 'postrawtransaction';
       let response: any = null;

       const data = {
        rawtx: txHex
       };

       try {
            if (txHex) {
                response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
            }
            if (response && response.txid) {
            txHash = '0x' + response.txid;
            }
       } catch (err: any) {
            if (err.error && err.error.Error) {
            errMsg = err.error.Error;
            console.log('err there we go', err.error.Error);
           }
       }

       //return ret;
       return {txHash, errMsg};
    }

    async postTx(coin, txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints[coin].exchangily + 'postrawtransaction';
        let response: any = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err: any) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

    async postBchTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.BCH.exchangily + 'postrawtransaction';
        let response: any = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err: any) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

     async postDogeTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.DOGE.exchangily + 'postrawtransaction';
        let response: any = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err: any) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

     async postLtcTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.LTC.exchangily + 'postrawtransaction';
        let response: any = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err: any) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }     
    async getEthBalance(address: string): Promise<Balance> {
       const url = environment.endpoints.ETH.exchangily + 'getbalance/' + address;
       const response = await this.http.get(url).toPromise()  as KEthBalance;
       const balance = response.balance;
       const lockbalance = 0;
       return {balance, lockbalance};  
    }

    async getEthereumCompatibleBalance(chain: string, address: string): Promise<any> {
        const url = environment.chains[chain].rpcEndpoint;
        console.log('url==', url);
        console.log('address==', address);
        const data = {
            "jsonrpc":"2.0",
            "method":"eth_getBalance",
            "params":[address, "latest"],
            "id":1
        };
        const response = await this.http.post(url, data).toPromise() as JsonResult;
        const result = response.result;

        return result;
        /*
        const url = environment.endpoints.ETH.exchangily + 'getbalance/' + address;
        const response = await this.http.get(url).toPromise()  as KEthBalance;
        const balance = response.balance;
        const lockbalance = 0;
        return {balance, lockbalance};  
        */
    }

    async getBchBalance(address: string): Promise<Balance> {
        const url = environment.endpoints.BCH.exchangily + 'getbalance/' + address;
        const response = await this.http.get(url).toPromise()  as number;
        const balance = response;
        const lockbalance = 0;
        return {balance, lockbalance};  
     }

    async getEthTokenBalance(name: string, contractAddress: string, address: string) {
        /*
        const url = environment.endpoints.ETH.etherscan + 'api?module=account&action=tokenbalance&contractaddress='
        + contractAddress + '&address=' + address + '&tag=latest&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        console.log('url for getEthTokenBalance=' + url);
        const response = await this.http.get(url).toPromise()  as EthBalance;
        const balance = response.result;
        */
       if (name === 'USDT') {
        contractAddress = environment.addresses.smartContract.USDT.ETH;
       }
       let balance = 0;
       try {
        const url = environment.endpoints.ETH.exchangily + 'callcontract/' + contractAddress + '/' + address;
        const response = await this.http.get(url).toPromise()  as KEthBalance;
        balance = response.balance; 
       } catch(e) {
           
       }
      
        const lockbalance = 0;
        return {balance, lockbalance}; 
    }

    getWalletBalance(data) {
        const url = environment.endpoints.kanban + 'walletBalances';
        return this.http.post(url, data);
    }

    getTransactionHistoryEvents(data) {
        const url = environment.endpoints.api + 'v3/transaction/history';
        return this.http.post(url, data);
    }

    async getFabTransactionReceiptAsync(txid: string) {
        const url = environment.endpoints.FAB.exchangily + 'gettransactionreceipt/' + txid;

        return await this.http.get(url).toPromise();
    }

    async fabCallContract(contractAddress: string, fxnCallHex: string) {
        if(!contractAddress) {
            return '';
        }
        const url = environment.endpoints.FAB.exchangily + 'callcontract';

        contractAddress = this.utilServ.stripHexPrefix(contractAddress);     
        const data = {address: contractAddress, data: fxnCallHex};

        const formData: FormData = new FormData(); 
        formData.append('address', contractAddress); 
        formData.append('data', fxnCallHex); 

        const response = await this.http.post(url, formData).toPromise() as FabTokenBalance;
        return response;
    }

    async getFabTokenBalance(name: string, address: string, contractAddress?: string | undefined) {
        if(!contractAddress) {
            contractAddress = environment.addresses.smartContract[name];
        }
        if(typeof contractAddress != 'string' && contractAddress) {
            
            contractAddress = contractAddress['FAB'];
        }
        let fxnCallHex = this.web3Serv.getFabTokenBalanceOfABI([address]);

        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex); 
        if(!contractAddress) {
            return {balance: -1, lockbalance: -1}; 
        }
        const response = await this.fabCallContract(contractAddress, fxnCallHex);    
        let balance = 0;
        const lockbalance = 0;
        if (response && response.executionResult && response.executionResult.output) {
            const balanceHex = response.executionResult.output;
            balance = parseInt(balanceHex, 16);
        }
        return {balance, lockbalance};    
    }
    async getExgBalance(address: string) {
        const contractAddress = environment.addresses.smartContract.EXG.FAB;
        // console.log('contractAddress=' + contractAddress + ',address=' + address);
        let fxnCallHex = this.web3Serv.getFabBalanceOfABI([address]);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex); 

        //console.log('fxnCallHex for EXGA', fxnCallHex);
        let response: any = await this.fabCallContract(contractAddress, fxnCallHex);

        // console.log('response=', response);
        let balance = 0;
        if (response && response.executionResult && response.executionResult.output) {
            const balanceHex = response.executionResult.output;
            balance = parseInt(balanceHex, 16);
        }



        fxnCallHex = this.web3Serv.getFabFrozenBalanceABI([address]);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);
        
        response = await this.fabCallContract(contractAddress, fxnCallHex);

        let lockbalance = 0;
        if (response && response.executionResult && response.executionResult.output) {
            const balanceHex = response.executionResult.output;
            // console.log('response here we go:', response);
            
            if (balanceHex) {
                lockbalance = parseInt(balanceHex, 16);
            }
        }
        return {balance, lockbalance};
    }

    postCampaignSingleDetail(id: string) {
        const url = environment.endpoints.kanban + 'kanban/getCampaignSingle';
        const data = {"id":id};
        return this.http.post(url, data);
    }
}
