import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import {Signature, EthTransactionObj} from '../interfaces/kanban.interface';
import {UtilService} from './util.service';
@Injectable({
    providedIn: 'root'
    })
export class Web3Service {
    constructor(private utilServ: UtilService) {
    }    

    getWeb3Provider() {
        if (typeof window.web3 !== 'undefined') {
          return new Web3(window.web3.currentProvider);
        } else {
          const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/6c5bdfe73ef54bbab0accf87a6b4b0ef');
          return web3;
        }}

    signMessageWithPrivateKey(message: string, keyPair: any) {

      const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
      const web3 = this.getWeb3Provider();

      const signMess = web3.eth.accounts.sign(message, privateKey);
      return signMess;
    }

    async signTxWithPrivateKey(txParams: any, keyPair: any) {
      const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
      console.log('signTxWithPrivateKey begin');
      console.log('privateKey=' + privateKey);
      console.log('address=' + keyPair.address);
      console.log(txParams);
      const web3 = this.getWeb3Provider();

      const signMess = await web3.eth.accounts.signTransaction(txParams, privateKey) as EthTransactionObj;
      console.log('signMess in signMessageWithPrivateKey=');
      console.log(signMess);
      return signMess.rawTransaction;
    }

    async sendSignedTransaction(txhex: string) {
      const web3 = this.getWeb3Provider();
      return await web3.eth.sendSignedTransaction(txhex);
    }

    async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number, includeCoin: boolean) {
      console.log('abiHex=' + abiHex);
      console.log('nonce=' + nonce);
      const txObject = {
        to: address,
        nonce: nonce,
        data: '0x' + abiHex,
        gas: 1000000,
        coin: '0x',
        gasPrice: 40
      };
      const txObjectWithoutCoin = {
        to: address,
        nonce: nonce,
        data: '0x' + abiHex,
        gas: 1000000,
        gasPrice: 40
      };


      const customCommon = Common.forCustomChain(
        'test',
        {
          name: 'test',
          networkId: 212,
          chainId: 212
        },
        'byzantium',
      );   
      
      const privKey = Buffer.from(keyPair.privateKeyHex, 'hex');
      const EthereumTx = Eth.Transaction;  
      const tx = new EthereumTx(includeCoin ? txObject : txObjectWithoutCoin, { common: customCommon });
      
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      const txhex = '0x' + serializedTx.toString('hex'); 
      return txhex;
      
     

     /*
     const web3 = this.getWeb3Provider();

     const signMess = await web3.eth.accounts.signTransaction(txObject, privateKey) as EthTransactionObj;
     console.log('signMess in signMessageWithPrivateKey=');
     console.log(signMess);
     return signMess.rawTransaction;   
     */  
    }

    getCreateOrderFuncABI(paramsArray: any) {
        const web3 = this.getWeb3Provider();
        const func =     {
          "constant": false,
          "inputs": [
            {
              "name": "_bidOrAsk",
              "type": "bool"
            },
            {
              "name": "_orderType",
              "type": "uint8"
            },
            {
              "name": "_baseCoin",
              "type": "uint32"
            },
            {
              "name": "_targetCoin",
              "type": "uint32"
            },
            {
              "name": "_amount",
              "type": "uint256"
            },
            {
              "name": "_price",
              "type": "uint256"
            },
            {
              "name": "_expiredTime",
              "type": "uint256"
            },
            {
              "name": "_orderHash",
              "type": "bytes32"
            }
          ],
          "name": "createOrder",
          "outputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }; 
      const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
      return abiHex;
    }

    getFuncABI(func) {
      const web3 = this.getWeb3Provider();
      const abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);
      return abiHex;
    }



    getDepositFuncABI(coinType: number, txHash: string, amount: number, addressInKanban: string, signedMessage: Signature) {
        console.log('input of getDepositFuncABI');
        console.log('coinType=' + coinType);
        console.log('txHash=' + txHash);
        console.log('amount=' + amount);
        console.log('addressInKanban=' + addressInKanban);
        console.log('signedMessage=');
        console.log(signedMessage);
        const web3 = this.getWeb3Provider();
        const func = {
          "constant": false,
          "inputs": [
            {
              "name": "_coinType",
              "type": "uint32"
            },
            {
              "name": "",
              "type": "bytes32"
            },
            {
              "name": "_value",
              "type": "uint256"
            },
            {
              "name": "_addressInKanban",
              "type": "address"
            },
            {
              "name": "",
              "type": "bytes32"
            },
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "deposit",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        };
      let abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);
      abiHex += signedMessage.v.substring(2);
      abiHex += this.utilServ.fixedLengh(coinType, 62);
      abiHex += txHash.substring(2);
      const amountHex = amount.toString(16);
      abiHex += this.utilServ.fixedLengh(amountHex, 64);
      abiHex += this.utilServ.fixedLengh(addressInKanban.substring(2), 64);
      abiHex += signedMessage.r.substring(2);
      abiHex += signedMessage.s.substring(2);
      console.log('abiHex=');
      console.log(abiHex);
      return abiHex;

    }
}
