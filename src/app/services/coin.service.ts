import { Injectable } from '@angular/core';
import { MyCoin } from '../models/mycoin';
import { TxRef } from '../interfaces/balance.interface';
import * as BIP32 from 'node_modules/bip32';
import * as Btc from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import * as fabcoinjs from 'node_modules/fabcoinjs-lib/src';
import * as hdkey from 'ethereumjs-wallet/hdkey';
import * as Wallet from 'ethereumjs-wallet';
import * as EthUtil from 'ethereumjs-util';
import { BitcoinTransaction } from 'src/app/models/transaction';
import { Address } from '../models/address';
import {offical_addresses, coin_list} from '../config/coins';
import * as Eth from 'ethereumjs-tx';
import {ApiService} from './api.service';
import {bitcoin_network} from '../config/networks';
import * as wif from 'wif';
import Common from 'ethereumjs-common';
import { Web3Service } from './web3.service';
import {Signature} from '../interfaces/kanban.interface';
import { UtilService } from './util.service';

@Injectable()
export class CoinService {
    constructor(private apiService: ApiService, private web3Serv: Web3Service, private utilServ: UtilService) {
    } 

    getCoinTypeIdByName(name: string) {
        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.name === name) {
                return coin.id;
            }
        }
        return -1;
    }

    initToken(type: string, name: string, decimals: number, address: string, baseCoin: MyCoin) {
        const coin = new MyCoin(name);
        coin.tokenType = type;
        coin.decimals = decimals;
        coin.contractAddr = address;
        coin.coinType = baseCoin.coinType;
        const addr = new Address(baseCoin.coinType, baseCoin.receiveAdds[0].address, 0);
        coin.receiveAdds.push(addr);
        return coin;
    }

    initMyCoins(seed: Buffer): MyCoin[] {
        const myCoins = new Array();

        let coin = new MyCoin('EXG');
        this.fillUpAddress(coin, seed, 1, 0);
        myCoins.push(coin);
        coin = new MyCoin('FAB');
        this.fillUpAddress(coin, seed, 100, 100);
        myCoins.push(coin);

        coin = new MyCoin('BTC');
        this.fillUpAddress(coin, seed, 100, 100);

        myCoins.push(coin);    
        coin = new MyCoin('ETH');
        this.fillUpAddress(coin, seed, 1, 0);
        myCoins.push(coin); 
        coin = new MyCoin('USDT');
        this.fillUpAddress(coin, seed, 1, 0);
        myCoins.push(coin);  
                        
        return myCoins;
    }

    initExCoin(seed: Buffer): MyCoin {
        const coin = new MyCoin('EX');
        this.fillUpAddress(coin, seed, 1, 0);   
        return coin;     
    }

    getOfficialAddress(myCoin: MyCoin) {
        const addresses = offical_addresses;
        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].name === myCoin.name) {
                return addresses[i].address;
            }
        }
        return '';
    }

    async getBlanceByAddress (tokenType: string, contractAddr: string, name: string, addr: string, decimals: number) {
        let balance = 0;
        if (name === 'BTC') {
            balance = await this.apiService.getBtcBalance(addr);
            balance = balance / 1e8;
        } else 
        if (name === 'ETH') {
            balance = await this.apiService.getEthBalance(addr);
            balance = balance / 1e18;
        } else 
        if (name === 'FAB') {
            balance = await this.apiService.getFabBalance(addr);
        } else
        if (tokenType === 'ETH') {
            if (!decimals) {
                decimals = 18;
            }
            balance = await this.apiService.getEthTokenBalance(contractAddr, addr);
            balance = balance / Math.pow(10, decimals);
        }
        return balance;
    }
    async getBalance(myCoin: MyCoin) {
        let balance = 0;
        let totalBalance = 0;
        const coinName = myCoin.name;
        const tokenType = myCoin.tokenType;
        const contractAddr = myCoin.contractAddr;

        let receiveAddsLen = myCoin.receiveAdds.length;
        let changeAddsLen = myCoin.changeAdds.length;

        if (coinName === 'BTC') {
            receiveAddsLen = (receiveAddsLen > 3) ? 3 : receiveAddsLen;
            changeAddsLen = (changeAddsLen > 3) ? 3 : changeAddsLen;
        }

        for (let i = 0; i < receiveAddsLen; i ++) {
            const addr = myCoin.receiveAdds[i].address;
            const decimals = myCoin.decimals;
            balance = await this.getBlanceByAddress(tokenType, contractAddr, coinName, addr, decimals);
            myCoin.receiveAdds[i].balance = balance;
            totalBalance += balance;
        }

        for (let i = 0; i < changeAddsLen; i ++) {
            const addr = myCoin.changeAdds[i].address;
            const decimals = myCoin.decimals;
            balance = await this.getBlanceByAddress(tokenType, contractAddr, coinName, addr, decimals);
            myCoin.changeAdds[i].balance = balance;
            totalBalance += balance;
        }

        return totalBalance;
    }

    getExPrivateKey(excoin: MyCoin, seed: Buffer) {
        const root = hdkey.fromMasterSeed(seed);
        const address1 = excoin.receiveAdds[0];
        const currentIndex = address1.index;        
        const wallet = root.derivePath( "m/44'/" + excoin.coinType + "'/0/" + currentIndex ).getWallet();
        const privateKey = wallet.getPrivateKey();  
        console.log('address is for getExPrivateKey:' + excoin.receiveAdds[0].address);
        return privateKey;
    }

    getKeyPairs(coin: MyCoin, seed: Buffer, chain: number, index: number) {
        const name = coin.name;
        

        const tokenType = coin.tokenType;
        let addr = '';
        let priKey = '';
        let buffer = Buffer.alloc(32);
        const path = "m/44'/" + coin.coinType + "'/0'/" + chain + "/" + index;

        if (name === 'BTC' || name === 'FAB') {
            const root = BIP32.fromSeed(seed, bitcoin_network);
            const childNode = root.derivePath( path );
            const { address } = Btc.payments.p2pkh({
                pubkey: childNode.publicKey,
                network: bitcoin_network
            });
            addr = address;
            priKey = childNode.toWIF();
            buffer = wif.decode(priKey);               
        } else 
        if (name === 'ETH' || name === 'USDT' || name === 'EXG' || tokenType === 'ETH') {

            const root = hdkey.fromMasterSeed(seed);
            console.log('path=' + path);
            const childNode = root.derivePath( path );

            const wallet = childNode.getWallet();
            const address = `0x${wallet.getAddress().toString('hex')}`;
            addr = address;
            buffer = wallet.getPrivateKey();  
            priKey = wallet.getPrivateKey();        
        } else  
        if (name === 'EX') { 
            console.log('name=' + name);
            const root = BIP32.fromSeed(seed, bitcoin_network);

            const childNode = root.derivePath( path );    
                   
            priKey = childNode.toWIF(); 
            console.log('priKey for EX:' + priKey);
            buffer = wif.decode(priKey);  

            const publicKey = childNode.publicKey;
            const publicKeyString = `0x${publicKey.toString('hex')}`;
            addr = this.utilServ.toKanbanAddress(publicKeyString);
            console.log('addr for EX:' + addr);
            /*
            const privateKeyBuffer = wif.decode(priv.ateKey); 
            const wallet = Wallet.fromPrivateKey(privateKeyBuffer.privateKey);  
            const address = `0x${wallet.getAddress().toString('hex')}`;
            addr = address; 
            priKey = wallet.getPrivateKey();    
            buffer = wallet.getPrivateKey();   
            */  
              
        }

        const keyPairs = {
            address: addr,
            privateKey: priKey,
            privateKeyBuffer: buffer,
            name: name
        };        

        return keyPairs;
    }

    signedMessage(originalMessage: string , keyPair: any) {
        let signature: Signature;
        /*
        console.log('privateKeyBuffer in signedMessage');
        const privateKey = wif.encode(128, privateKeyBuffer, true);
        console.log(privateKeyBuffer);
        console.log('privateKey=');
        console.log(privateKey);
        const keyPair = Btc.ECPair.fromWIF(privateKey);
        const pKey = keyPair.privateKey;  
        console.log('pKey=');
        console.log(pKey);      
        console.log('originalMessage=');
        console.log(originalMessage);
        let message = String.fromCharCode.apply(null, originalMessage);
        message = 'hello';
        const signature = bitcoinMessage.sign(message, pKey, keyPair.compressed);
        console.log('signature===');
        console.log(signature);
        */
        const name = keyPair.name;

        if (name === 'ETH') {
            signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
            console.log('signature in signed is ');
            console.log(signature);
        } else 
        if (name === 'FAB' || name === 'BTC') {
            //signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
            const signBuffer = bitcoinMessage.sign(originalMessage, keyPair.privateKeyBuffer.privateKey, keyPair.privateKeyBuffer.compressed);
            const signHex = `${signBuffer.toString('hex')}`;
            const v = `0x${signBuffer.slice(0, 1).toString('hex')}`;
            const r = `0x${signBuffer.slice(1, 33).toString('hex')}`;
            const s = `0x${signBuffer.slice(33, 65).toString('hex')}`;
            console.log(r);
            console.log(s);
            console.log(v);
            console.log(signHex);
            signature = {r: r, s: s, v: v};
            /*
            console.log(keyPair.privateKey);
            console.log(keyPair.privateKeyBuffer);
            const signBuffer = bitcoinMessage.sign(originalMessage, keyPair.privateKeyBuffer.privateKey, keyPair.privateKeyBuffer.compressed);
            console.log('signBuffer===');
            console.log(signBuffer);
            const flagByte = signBuffer.readUInt8(0) - 27;
            const recover = flagByte & 3;
            let a = [this.slice(64, this.length(signBuffer), signBuffer), this.slice(0, 32, signBuffer), this.slice(32, 64, signBuffer)];
            console.log(a);
            */
        }
        return signature;
    }

    formCoinType(v:string, coinType: number) {
        let retString = v;
        retString = retString + this.utilServ.fixedLengh(coinType, 32 - v.length);
        return retString;
    }

    getOriginalMessage(coinType: number, txHash: string, amount: number, address: string) {
        /*
        const bufCoin = Buffer.allocUnsafe(2initMyCoins);
        bufCoin.writeUInt16BE(coinType,0);  initMyCoins      
        const bufTxHash = Buffer.from(txHashinitMyCoins);
        const bufAmount = Buffer.allocUnsafeinitMyCoins(32);
        bufAmount.writeUInt32BE(amount,0);
        const bufAddr = Buffer.from(address);
        const arr = [bufCoin, bufTxHash, bufAmount, bufAddr];
        const buf = Buffer.concat(arr);
        */
        console.log('coinType = ' + coinType);
        console.log('txHash = ' + txHash);
        console.log('amount = ' + amount);
        console.log('address = ' + address);
        let buf = '';
        buf += this.utilServ.fixedLengh(coinType, 4);
        buf += this.utilServ.fixedLengh(txHash, 64);
        const hexString = amount.toString(16);
        buf += this.utilServ.fixedLengh(hexString, 64);
        buf += this.utilServ.fixedLengh(address, 64);
        console.log('buf = ' + buf);
        console.log('buf.length=' + buf.length);
        return buf;
    }

    async sendTransaction(mycoin: MyCoin, seed: Buffer, toAddress: string, amount: number) {
        let index = 0;
        let balance = 0;
        let finished = false;
        let address = '';
        let totalInput = 0;
        

        const receiveAddsIndexArr = [];
        const changeAddsIndexArr = [];

        console.log('mycoin=');
        console.log(mycoin);
        let amountNum = amount * Math.pow(10, this.utilServ.getDecimal(mycoin));
        console.log('toAddress=' + toAddress + ',amount=' + amount + ',amountNum=' + amountNum);
        const TestNet = Btc.networks.testnet;
        console.log('TestNet===');
        console.log(TestNet);
        if (mycoin.name === 'BTC') { // btc address format
            const txb = new Btc.TransactionBuilder(TestNet);

            for (index = 0; index < mycoin.receiveAdds.length; index ++) {
                balance = mycoin.receiveAdds[index].balance;
                if (balance <= 0) {
                    continue;
                }
                address = mycoin.receiveAdds[index].address;
                const balanceFull = await this.apiService.getBtcBalanceFull(address);
                for (let i = 0; i < balanceFull.txrefs.length; i++) {
                    const tx = balanceFull.txrefs[i];
                    console.log('i=' + i);
                    console.log(tx);
                    if ((tx.tx_output_n < 0) || tx.spent) {
                        continue;
                    }
                    txb.addInput(tx.tx_hash, tx.tx_output_n);
                    amountNum -= tx.value;
                    totalInput += tx.value;
                    receiveAddsIndexArr.push(index);

                    if (amountNum <= 0) {
                        finished = true;
                        break;
                    }
                }    
                if (finished) {
                    break;
                }                            
            }
            if (!finished) {
                for (index = 0; index < mycoin.changeAdds.length; index ++) {
                    balance = mycoin.changeAdds[index].balance;
                    if (balance <= 0) {
                        continue;
                    }
                    address = mycoin.changeAdds[index].address;
                    const balanceFull = await this.apiService.getBtcBalanceFull(address);
                    for (let i = 0; i < balanceFull.txrefs.length; i++) {
                        const tx = balanceFull.txrefs[i];
                        console.log('i=' + i);
                        console.log(tx);
                        if ((tx.tx_output_n < 0) || tx.spent) {
                            continue;
                        }
                        txb.addInput(tx.tx_hash, tx.tx_output_n);
                        amountNum -= tx.value;
                        totalInput += tx.value;
                        changeAddsIndexArr.push(index);
    
                        if (amountNum <= 0) {
                            finished = true;
                            break;
                        }
                    }    
                    if (finished) {
                        break;
                    }                            
                }
            }

            if (!finished) {
                return '';
            }

            
            const changeAddress = mycoin.changeAdds[0];
            const output1 = Math.round(totalInput - amount * 1e8 - 3000 
            - (receiveAddsIndexArr.length + changeAddsIndexArr.length) * 300);
            console.log('output1=' + output1);
            const output2 = amount * 1e8;
            console.log('output2=' + output2);            
            txb.addOutput(changeAddress.address, output1);
            txb.addOutput(toAddress, output2);

            console.log('receiveAddsIndexArr=');
            console.log(receiveAddsIndexArr);
            console.log('changeAddsIndexArr='); 
            console.log(changeAddsIndexArr);
            for (index = 0; index < receiveAddsIndexArr.length; index ++) {
                const keyPair = this.getKeyPairs(mycoin, seed, 0, receiveAddsIndexArr[index]);
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, TestNet);
                txb.sign(index, alice);                
            }

            for (index = 0; index < changeAddsIndexArr.length; index ++) {
                const keyPair = this.getKeyPairs(mycoin, seed, 1, changeAddsIndexArr[index]);
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, TestNet);
                txb.sign(receiveAddsIndexArr.length + index, alice);                
            }             
            /*
            const address1 = mycoin.receiveAdds[0];
            const currentIndex = address1.index;

            const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, bitcoin_network);

            const txb = new Btc.TransactionBuilder(bitcoin_network);
            
            const balanceFull = await this.apiService.getBtcBalanceFull(address1.address);

            txb.setVersion(1);
   
            for (let i = 0; i < balanceFull.txrefs.length; i++) {
                const tx = balanceFull.txrefs[i];
                console.log('i=' + i);
                console.log(tx);
                if (tx.tx_output_n < 0) {
                    continue;
                }
                txb.addInput(tx.tx_hash, tx.tx_output_n);
                amountNum -= tx.ref_balance;
                if (amountNum <= 0) {
                    break;
                }
            }
            

           txb.addOutput(address1.address, parseInt(amount))

            txb.sign({
              prevOutScriptType: 'p2pkh',
              vin: 0,
              keyPair: alice
            });
            */
            const txhex = txb.build().toHex();
            const txhash = this.apiService.postBtcTx(txhex);

            return txhash;
        } else 
        if (mycoin.name === 'FAB') {

            const txb = new Btc.TransactionBuilder(TestNet);
            
            for (index = 0; index < mycoin.receiveAdds.length; index ++) {
                balance = mycoin.receiveAdds[index].balance;
                if (balance <= 0) {
                    continue;
                }
                address = mycoin.receiveAdds[index].address;

                const fabTransactions = await this.apiService.getFabTransaction(address);

                for (let i = 0; i < fabTransactions.result.length; i++) {
                    const utxos = fabTransactions.result[i].utxos;
    
                    for (let j = 0; j < utxos.length; j++) {
                        const utxo = utxos[j];
                        txb.addInput(utxo.txid, utxo.sequence);
                        receiveAddsIndexArr.push(index);
                        console.log('utxo.txid=' + utxo.txid + ',utxo.sequence=' + utxo.sequence + ',utxo.value=' + utxo.value);
                        totalInput += utxo.value * Math.pow(10, this.utilServ.getDecimal(mycoin));
                        amountNum -= utxo.value * Math.pow(10, this.utilServ.getDecimal(mycoin));
                        console.log('totalInput=' + totalInput + ',amountNum=' + amountNum);
                        if (amountNum <= 0) {
                            finished = true;
                          totalInput += utxo.value;  break;
                        }                    
                    }
                    if (finished) {
                        break;
                    }
                }    
                if (finished) {
                    break;
                }              
            }



            if (!finished) {
                for (index = 0; index < mycoin.changeAdds.length; index ++) {
                    balance = mycoin.changeAdds[index].balance;
                    if (balance <= 0) {
                        continue;
                    }
                    address = mycoin.changeAdds[index].address;
    
                    const fabTransactions = await this.apiService.getFabTransaction(address);
    
                    for (let i = 0; i < fabTransactions.result.length; i++) {

                        const utxos = fabTransactions.result[i].utxos;
        
                        for (let j = 0; j < utxos.length; j++) {
                            const utxo = utxos[j];
                            txb.addInput(utxo.txid, utxo.sequence);
                            changeAddsIndexArr.push(index);
                            console.log('utxo.txid=' + utxo.txid + ',utxo.sequence=' + utxo.sequence + ',utxo.value=' + utxo.value);
                            totalInput += utxo.value * Math.pow(10, this.utilServ.getDecimal(mycoin));
                            amountNum -= utxo.value * Math.pow(10, this.utilServ.getDecimal(mycoin));
                            console.log('totalInput=' + totalInput + ',amountNum=' + amountNum);
                            if (amountNum <= 0) {
                                finished = true;
                                break;
                            }                    
                        }
                        if (finished) {
                            break;
                        }
                    }    
                    if (finished) {
                        break;
                    }              
                }
            }

            if (!finished) {
                console.log('not enough fund.');
                return '';
            }

            console.log('totalInput = ' + totalInput);

            const changeAddress = mycoin.changeAdds[0];
            const output1 = Math.round(totalInput
            - amount * Math.pow(10, this.utilServ.getDecimal(mycoin)) - 3000 
            - (receiveAddsIndexArr.length + changeAddsIndexArr.length) * 300);
            console.log('output1=' + output1);
            const output2 = amount * 1e8;
            console.log('output2=' + output2);            
            txb.addOutput(changeAddress.address, output1);
            txb.addOutput(toAddress, output2);

            console.log('receiveAddsIndexArr=');
            console.log(receiveAddsIndexArr);
            console.log('changeAddsIndexArr='); 
            console.log(changeAddsIndexArr);
            for (index = 0; index < receiveAddsIndexArr.length; index ++) {
                const keyPair = this.getKeyPairs(mycoin, seed, 0, receiveAddsIndexArr[index]);
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, TestNet);
                txb.sign(index, alice);                
            }

            for (index = 0; index < changeAddsIndexArr.length; index ++) {
                const keyPair = this.getKeyPairs(mycoin, seed, 1, changeAddsIndexArr[index]);
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, TestNet);
                txb.sign(receiveAddsIndexArr.length + index, alice);                
            }            
            /*
            const address1 = mycoin.receiveAdds[0];
            const exchangeAddress = mycoin.changeAdds[0];
            const currentIndex = address1.index;

           const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, TestNet);

            const fabTransactions = await this.apiService.getFabTransaction(address1.address);

            for (let i = 0; i < fabTransactions.result.length; i++) {
                const utxos = fabTransactions.result[i].utxos;

                for (let j = 0; j < utxos.length; j++) {
                    const utxo = utxos[j];
                    txb.addInput(utxo.txid, utxo.sequence);
                    amountNum -= utxo.value;
                    if (amountNum <= 0) {
                        finished = true;
                        break;
                    }                    
                }
                if (finished) {
                    break;
                }
            }            

            console.log('amount=' + amount);
            txb.addOutput(exchangeAddress.address, 100 * 1e8 - parseInt(amount) * 1e8 - 3000);
            txb.addOutput(toAddress, parseInt(amount) * 1e8);
            txb.sign({
                prevOutScriptType: 'p2pkh',
                vin: 0,
                keyPair: alice
              });
            */
            const txhex = txb.build().toHex();
            const txhash = this.apiService.postFabTx(txhex);
            return txhash;
        } else
        if (mycoin.name === 'ETH') {
            amountNum = amount * 1e18;
            const EthereumTx = Eth.Transaction;

            const address1 = mycoin.receiveAdds[0];
            const currentIndex = address1.index;    
            
            const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
            const nonce = await this.apiService.getEthNonce(address1.address);
            const txParams = {
                nonce: nonce,
                gasPrice: 1200000000,
                gasLimit: 22000,
                to: toAddress,
                value: amountNum           
            };

            const txhex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);

            console.log('txhex=' + txhex);
            /*
            const tx = new EthereumTx(txParams,{ chain: 'ropsten', hardfork: 'petersburg' })

            tx.sign(keyPair.privateKeyBuffer); 

            const serializedTx = tx.serialize()
            const txhex = '0x' + serializedTx.toString('hex');
            */
            const txHash = this.apiService.postEthTx(txhex);
            return txHash;

        } else 
        if (mycoin.tokenType === 'ETH') { // etheruem tokens
            const address1 = mycoin.receiveAdds[0];

            const currentIndex = address1.index;    
            console.log('currentIndex=' + currentIndex);
            const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
            const nonce = await this.apiService.getEthNonce(address1.address);

            let decimals = mycoin.decimals;
            if (!decimals) {
                decimals = 18;
            }
            const amountSent = amount * Math.pow(10, decimals);
            const toAccount = toAddress;
            const contractAddress = mycoin.contractAddr;

            console.log('nonce = ' + nonce);
            const func =    {  
                "constant":false,
                "inputs":[  
                   {  
                      "name":"recipient",
                      "type":"address"
                   },
                   {  
                      "name":"amount",
                      "type":"uint256"
                   }
                ],
                "name":"transfer",
                "outputs":[  
                   {  
                      "name":"",
                      "type":"bool"
                   }
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
             };
            
            const abiHex = this.web3Serv.getFuncABI(func);
            // a9059cbb
            console.log('abiHexxx=' + abiHex);

            const txData = {
                nonce: nonce,
                gasPrice: 100,
                gasLimit: 55000,
               // to: contractAddress,
                from: keyPair.address,
                value: Number(0),         
                to : contractAddress,
                data: '0x' + abiHex + this.utilServ.fixedLengh(toAccount.slice(2), 64) + 
                this.utilServ.fixedLengh(amountSent.toString(16), 64)
            };

            console.log('txData=');
            console.log(txData);
            const txhex = await this.web3Serv.signTxWithPrivateKey(txData, keyPair);
            const txHash = this.apiService.postEthTx(txhex);
            return txHash;

        } else
        if (mycoin.tokenType === 'FAB') { // fab tokens

        }

    }

    fillUpAddress(mycoin: MyCoin, seed: Buffer, numReceiveAdds: number, numberChangeAdds: number) {
        console.log('fillUpAddress for MyCoin');
        console.log(mycoin);
        for (let i = 0; i < numReceiveAdds; i++) {
            const keyPair = this.getKeyPairs(mycoin, seed, 0, i);
            const addr = new Address(mycoin.coinType, keyPair.address, i);
            mycoin.receiveAdds.push(addr);            
        }
        for (let i = 0; i < numberChangeAdds; i++) {
            const keyPair = this.getKeyPairs(mycoin, seed, 1, i);
            const addr = new Address(mycoin.coinType, keyPair.address, i);
            mycoin.changeAdds.push(addr);            
        }        
        /*
        const TestNet = Btc.networks.testnet;
        let index = 0;            console.log();
            console.log();
        if (mycoin.name ===            console.log(); 'BTC') { // btc address format
            const root = BI            console.log();P32.fromSeed(seed, TestNet);
            if (mycoin.receiveAdds.length > 0) {
                index = mycoin.receiveAdds[mycoin.receiveAdds.length - 1].index;
            }
            for (let i = 0; i < numReceiveAdds; i++) {
                const currentIndex = i + index;
                const path = "m/44'/" + mycoin.coinType + "'/0'/0/" + currentIndex;
                console.log('path=' + path);
                const child1 = root.derivePath(path);  
                
                const { address } = Btc.payments.p2pkh({
                    pubkey: child1.publicKey,
                    network: TestNet
                }); 

                const addr = new Address(mycoin.coinType, address, currentIndex);
                mycoin.receiveAdds.push(addr);
            }

            index = 0;
            if (mycoin.changeAdds.length > 0) {
                index = myc            console.log();oin.changeAdds[mycoin.changeAdds.length - 1].index;
            }            console.log();
            for (let i = 0;            console.log(); i < numberChangeAdds; i++) {
                const curre            console.log();ntIndex = i + index;
                const path = "m/44'/"+mycoin.coinType+"'/0'/1/" + currentIndex;
                console.log('path=' + path);
                const child1 = root.derivePath(path);  
                
                const { address } = Btc.payments.p2pkh({
                    pubkey: child1.publicKey,
                    network: TestNet
                }); 

                const addr = new Address(mycoin.coinType, address, currentIndex);
                mycoin.changeAdds.push(addr);
            } 

        } else 
        if (mycoin.name ===            console.log(); 'FAB') {
            const testnet =            console.log(); Btc.networks.testnet;
            const root = BI            console.log();P32.fromSeed(seed, testnet);
            console.log('ro            console.log();ot=');
            console.log(root);
            if (mycoin.receiveAdds.length > 0) {
                index = mycoin.receiveAdds[mycoin.receiveAdds.length - 1].index;
            }
            for (let i = 0; i < numReceiveAdds; i++) {
                const currentIndex = i + index;
                const path = "m/44'/"+mycoin.coinType+"'/0'/0/" + currentIndex;
                console.log('path=' + path);
                const const address = `0x${wallet.getAddress().toString('hex')}`;child1 = root.derivePath(path);  
                const const address = `0x${wallet.getAddress().toString('hex')}`;{ address } = Btc.payments.p2pkh({ pubkey: child1.publicKey, network: testnet });
                const const address = `0x${wallet.getAddress().toString('hex')}`;addr = new Address(mycoin.coinType, address, currentIndex);
                mycoinconst address = `0x${wallet.getAddress().toString('hex')}`;.receiveAdds.push(addr); 
            }  
            
            index = 0;
            if (mycoin.changeAdds.length > 0) {
                index = mycoin.changeAdds[mycoin.changeAdds.length - 1].index;
            }
            for (let i = 0; i < numberChangeAdds; i++) {
                const currentIndex = i + index;
                const path = "m/44'/" + mycoin.coinType + "'/0'/1/" + currentIndex;
                console.log('path=' + path);
                const child1 = root.derivePath(path);  
            
                const { address } = Btc.payments.p2pkh({ pubkey: child1.publicKey, network: testnet });
                const addr = new Address(mycoin.coinType, address, currentIndex);
                mycoin.changeAdds.push(addr);                 
            }            
        } else  // etherem-wallet
        if ((mycoin.name === 'EXG') || (mycoin.name === 'ETH') || (mycoin.name === 'USDT')) {
            const root = hdkey.fromMasterSeed(seed);

            const path = "m/44'/" + mycoin.coinType + "'/0'/0/0";
            console.log('path=' + path);
            const child1 = root.derivePath(path);              
            const wallet = child1.getWallet();
            
            const address = `0x${wallet.getAddress().toString('hex')}`;
            const addr = new Address(mycoin.coinType, address, 0);
            mycoin.receiveAdds.push(addr);            
        } else 
        if (mycoin.name === 'EX') {
            const testnet = Btc.networks.testnet;
            const root = BIP32.fromSeed(seed, testnet);
            const path = "m/44'/"+mycoin.coinType+"'/0'/0/0";
            const child1 = root.derivePath(path); 
            let privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
            const privateKeyBuffer = EthUtil.toBuffer(privateKey);   
            const wallet = Wallet.fromPrivateKey(privateKeyBuffer);                     
          
        }
        */
    }      
}