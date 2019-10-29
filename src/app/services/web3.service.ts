import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import {Signature, EthTransactionObj} from '../interfaces/kanban.interface';
import {UtilService} from './util.service';
import * as ethUtil from 'ethereumjs-util';
import KanbanTxService from './kanban.tx.service';
import { environment } from '../../environments/environment';

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
          const web3 = new Web3(Web3.givenProvider || environment.chains.ETH.web3Provider);
          return web3;
        }}

    signMessageWithPrivateKey(message: string, keyPair: any) {

      const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
      const web3 = this.getWeb3Provider();

      const signMess = web3.eth.accounts.sign(message, privateKey);
      return signMess;
    }

    getTransactionHash(txhex: string) {
      const hash = ethUtil.keccak(txhex).toString('hex');
      return '0x' + hash;
    }

    async signTxWithPrivateKey(txParams: any, keyPair: any) {
      /*
      const privateKey = `0x${keyPair.privateKey.toString('hex')}`;

      console.log('in signTxWithPrivateKey');
      const web3 = this.getWeb3Provider();
      console.log('in111');
      console.log(txParams);
      console.log(privateKey);
      const signMess = await web3.eth.accounts.signTransaction(txParams, privateKey) as EthTransactionObj;
      console.log('in222');
      console.log(signMess);
      return signMess.rawTransaction;
      */
      const privKey = keyPair.privateKeyBuffer;
      const EthereumTx = Eth.Transaction;
      const tx = new EthereumTx(txParams, { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork });
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      const txhex = '0x' + serializedTx.toString('hex'); 
      return txhex;
    }

    async sendSignedTransaction(txhex: string) {
      const web3 = this.getWeb3Provider();
      return await web3.eth.sendSignedTransaction(txhex);
    }

    async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number, includeCoin: boolean) {
      console.log('abiHex before', abiHex);
      if (abiHex.startsWith('0x')) {
        abiHex = abiHex.slice(2);
      }
      console.log('abiHex after', abiHex);
      console.log('nonce=' + nonce);
      const txObject = {
        to: address,
        nonce: nonce,
        data: '0x' + abiHex,
        gas: 2000000,
        coin: '0x',
        gasPrice: 40000000000  // in wei
        // gasPrice: 40  // in wei
      };
      const txObjectWithoutCoin = {
        to: address,
        nonce: nonce,
        data: '0x' + abiHex,
        gas: 2000000,
        gasPrice: 50
      };



      
      const privKey = Buffer.from(keyPair.privateKeyHex, 'hex');

      let txhex = '';
      
      console.log('includeCoin=', includeCoin);
      if (!includeCoin) {
        const EthereumTx = Eth.Transaction;  
        //const tx = new EthereumTx(includeCoin ? txObject : txObjectWithoutCoin, { common: customCommon });
        console.log('txObjectWithoutCoin=', txObjectWithoutCoin);
        const tx = new EthereumTx(txObjectWithoutCoin, { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork });
        console.log('after that');
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        txhex = '0x' + serializedTx.toString('hex'); 
      } else {
        const customCommon = Common.forCustomChain(
          environment.chains.ETH.chain,
          {
            name: environment.chains.FAB.chain.name,
            networkId: environment.chains.FAB.chain.networkId,
            chainId: environment.chains.FAB.chain.chainId
          },
          environment.chains.ETH.hardfork,
        );           
        let tx = new KanbanTxService(txObject, { common: customCommon });
        if (environment.production) {
          tx = new KanbanTxService(txObject);
        }
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        txhex = '0x' + serializedTx.toString('hex');         
      }
      return txhex;
      
     

     /*
     const web3 = this.getWeb3Provider();

     const signMess = await web3.eth.accounts.signTransaction(txObject, privateKey) as EthTransactionObj;
     console.log('signMess in signMessageWithPrivateKey=');
     console.log(signMess);
     return signMess.rawTransaction;   
     */  
    }

    getFabFrozenBalanceABI(paramsArray: any) {
      const web3 = this.getWeb3Provider();
      const func = 	{
        "constant": true,
        "inputs": [
          {
            "name": "_account",
            "type": "address"
          }
        ],
        "name": "getTotalUnreleased",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }; 
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;    
    }

    getFabBalanceOfABI(paramsArray: any) {
      const web3 = this.getWeb3Provider();
      const func =     	{
        "constant": true,
        "inputs": [
          {
            "name": "accountOwner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }; 
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);

    console.log('paramsArray=', paramsArray);
    console.log('abiHex=', abiHex);
    return abiHex;      
    }

    getFabTransferABI(paramsArray: any) {
      const web3 = this.getWeb3Provider();
      const func =	{
        "constant": false,
        "inputs": [
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }; 
      const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
      return abiHex;       
    }

    getDeleteOrderFuncABI(orderHash: string) {
      const web3 = this.getWeb3Provider();
      const func = {
        "constant": false,
        "inputs": [
          {
            "name": "_orderHash",
            "type": "bytes32"
          }
        ],
        "name": "cancelOrder",
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
    const abiHex = web3.eth.abi.encodeFunctionCall(func, [orderHash]);
    return abiHex;
    }

    sha3(str: string) {
      const web3 = this.getWeb3Provider();
      return web3.utils.sha3(str);
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


    getWithdrawFuncABI (coinType: number, amount: number, destAddress: string) {

      // let abiHex = '3a5b6c70';

      const web3 = this.getWeb3Provider();
      const func = {
        "constant": false,
        "inputs": [
          {
            "name": "_coinType",
            "type": "uint32"
          },
          {
            "name": "_value",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "withdraw",
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
      console.log('abiHex there we go:' + abiHex);  
      abiHex += this.utilServ.fixedLengh(coinType, 64);
      console.log('abiHex1=' + abiHex);

      const amountHex = amount.toString(16);
      console.log('amount=' + amount);
      console.log('amountHex=' + amountHex);
      abiHex += this.utilServ.fixedLengh(amountHex, 64);
      console.log('abiHex2=' + abiHex);
      abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(destAddress), 64);
      console.log('abiHex final:' + abiHex);    
      return abiHex;
    }

    getDepositFuncABI(coinType: number, txHash: string, amount: number, addressInKanban: string, signedMessage: Signature) {

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

      return abiHex;

    }
}
