import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import {Signature} from '../interfaces/kanban.interface';
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
          const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
          return web3;
        }}

    signMessageWithPrivateKey(message: string, keyPair: any) {
      console.log('keyPair=');
      console.log(keyPair);
      const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
      const address = keyPair.address;
      console.log('begin signMessageWithPrivateKey');
      //privateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';
      const web3 = this.getWeb3Provider();
      console.log('message=' + message);
      console.log('address=' + address);
      console.log('privateKey is:' + privateKey);

      /*
      const messageHash = web3.utils.sha3(message);
      console.log('messageHash=' + messageHash);
      */
      const signMess = web3.eth.accounts.sign(message, privateKey);
      console.log('signMess is:');
      console.log(signMess);     
      /* 
      const signMessHash = web3.eth.accounts.sign(messageHash, privateKey);

      console.log('signMessHash is:');
      console.log(signMess);
      */
      console.log('end signMessageWithPrivateKey');
      return signMess;
    }

    signAbiHexWithPrivateKey(abiHex: string, privateKey: string, address: string) {
      console.log('abiHex=' + abiHex);
      console.log('privateKey=' + privateKey);
      const txObject = {
        to: address,
        nonce: 0,
        data: abiHex,
        gas: 100000,
        gasPrice: 0.00000000001
      };

      const prkey = Buffer.from(
        privateKey,
        'hex'
      );

      const EthereumTx = Eth.Transaction;

      const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'test',
          networkId: 212,
          chainId: 212
        },
        'homestead',
      );        
      const tx = new EthereumTx(txObject, { common: customCommon });
      tx.sign(prkey);
      console.log(tx.toJSON());
      const serializedTx = tx.serialize();
      const txhex = '0x' + serializedTx.toString('hex'); 
      console.log('txhex in here =' + txhex);
      return txhex;
    }

    getCreateOrderFuncABI(paramsArray: any) {
        const web3 = this.getWeb3Provider();
        const func =   {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "orderHash",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "_owner",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_bidOrAsk",
              "type": "bool"
            },
            {
              "indexed": false,
              "name": "_orderType",
              "type": "uint8"
            },
            {
              "indexed": false,
              "name": "_baseCoin",
              "type": "uint32"
            },
            {
              "indexed": false,
              "name": "_targetCoin",
              "type": "uint32"
            },
            {
              "indexed": false,
              "name": "_amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_price",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_expiredTime",
              "type": "uint256"
            }
          ],
          "name": "CreateOrder",
          "type": "event"
      }; 
      const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
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
