import { Injectable } from '@angular/core';
import Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import { Signature, EthTransactionObj } from '../interfaces/kanban.interface';
import { UtilService } from './util.service';
import * as ethUtil from 'ethereumjs-util';
import Common from 'ethereumjs-common';
import { environment } from '../../environments/environment';
import BigNumber from 'bignumber.js';
import * as createHash from 'create-hash';
import base58 from 'bs58';
import * as Account from 'eth-lib/lib/account';
import * as  Hash from 'eth-lib/lib/hash';
//import * as ethLib from 'eth-lib';
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  constructor(private utilServ: UtilService) {
  }

  getWeb3Provider() {
    /*
    if (typeof window.web3 !== 'undefined') {
      return new Web3(window.web3.currentProvider);
    } else {
      const web3 = new Web3(Web3.givenProvider);
      return web3;
    }
    */
   const web3 = new Web3();
   return web3;
  }

  formCreateSmartContractABI(abiArray, bytecode, args) {

    const web3 = this.getWeb3Provider();
    var MyContract = new web3.eth.Contract(abiArray);

    const abi = MyContract.deploy({
        data: bytecode,
        arguments: args
    })
    .encodeABI();   

    return abi;
  }


  signMessageWithPrivateKey(message: string, keyPair: any) {
    const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
    const web3 = this.getWeb3Provider();

    const signMess = web3.eth.accounts.sign(message, privateKey);
    //const signMess = this.sign(message, privateKey);
    return signMess;
  }

  signEtheruemCompatibleMessageWithPrivateKey(message: string, keyPair: any) {
    const privateKey = `0x${keyPair.privateKey.toString('hex')}`;

    const messageHash = this.hashEtherumMessage(message);
    var signature = Account.sign(messageHash, privateKey);
    var vrs = Account.decodeSignature(signature);
    return {
        message: message,
        messageHash: messageHash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
  }

  getTransactionHash(txhex: string) {
    //console.log('begin getTransactionHash');
    //console.log('txhex=', txhex);
    //const hash = ethUtil.keccak(Buffer.from(txhex, "utf-8")).toString('hex');
    if(txhex.indexOf('0x') === 0) {
      txhex = txhex.substring(2);
    }
    const hash = ethUtil.keccak(Buffer.from(txhex, "hex")).toString('hex');
    //console.log('hash=', hash);
    return '0x' + hash;
  }

  async signTxWithPrivateKey(txParams: any, keyPair: any) {
    const privKey = keyPair.privateKeyBuffer;
    const EthereumTx = Eth.Transaction;
    const tx = new EthereumTx(txParams, { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork });
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    const txhex = '0x' + serializedTx.toString('hex');
    return txhex;
  }

  async signEtheruemCompatibleTxWithPrivateKey(coinName: string, txParams: any, keyPair: any) {
    console.log('coinName');
    const privKey = keyPair.privateKeyBuffer;
    const EthereumTx = Eth.Transaction;
    const customCommon = Common.forCustomChain(
      environment.chains.ETH.chain, {
           name: environment.chains[coinName].chain.name,
           networkId: environment.chains[coinName].chain.networkId,
           chainId: environment.chains[coinName].chain.chainId
       },
       environment.chains[coinName].hardfork,
   );
    const tx = new EthereumTx(txParams, { common: customCommon });
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    const txhex = '0x' + serializedTx.toString('hex');
    return txhex;
  }

  sendGasHex(privateKey, address, amountInBigNumber: BigNumber, nonce) {

    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    var to = address;
    if(!to) {
        return '';
    }
    const txObject = {
      to: to,
      nonce: nonce,
      value: amountInBigNumber.toNumber(),
      gas: gasLimit,
      gasPrice: gasPrice  // in wei
    };
 
 
    const customCommon = Common.forCustomChain(
       environment.chains.ETH.chain, {
            name: environment.chains.KANBAN.chain.name,
            networkId: environment.chains.KANBAN.chain.networkId,
            chainId: environment.chains.KANBAN.chain.chainId
        },
        environment.chains.ETH.hardfork,
    );
 
    let tx = new Eth.Transaction(txObject, { common: customCommon });

    tx.sign(privateKey);
 
    const serializedTx = tx.serialize();
    const txhex = '0x' + serializedTx.toString('hex');
    return txhex;
 }

  async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number,
    value: any = 0, options = { gasPrice: 0, gasLimit: 0 }) {
    // console.log('abiHex before', abiHex);
    if (abiHex.startsWith('0x')) {
      abiHex = abiHex.slice(2);
    }

    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    if (options) {
      if (options.gasPrice) {
        gasPrice = options.gasPrice;
      }
      if (options.gasLimit) {
        gasLimit = options.gasLimit;
      }
    }
    // console.log('abiHex after', abiHex);

    const txObject = {
      to: address,
      nonce: nonce,
      data: abiHex ? ('0x' + abiHex) : null,
      value: value,
      gas: gasLimit,
      gasPrice: gasPrice  // in wei
    };

    const privKey = Buffer.from(keyPair.privateKeyHex, 'hex');

    let txhex = '';

    const customCommon = Common.forCustomChain(
      environment.chains.ETH.chain,
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      environment.chains.ETH.hardfork,
    );
    
    let tx = new Eth.Transaction(txObject, { common: customCommon });
    
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');
    return txhex;

    /*
    const web3 = this.getWeb3Provider();

    const signMess = await web3.eth.accounts.signTransaction(txObject, privateKey) as EthTransactionObj;
    console.log('signMess in signMessageWithPrivateKey=');
    console.log(signMess);
    return signMess.rawTransaction;   
    */
  }
  decodeParameters(types, data) {
    const web3 = this.getWeb3Provider();
    return web3.eth.abi.decodeParameters(types, data);
  }
  getFabFrozenBalanceABI(paramsArray: any) {
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': true,
      'inputs': [
        {
          'name': '_account',
          'type': 'address'
        }
      ],
      'name': 'getTotalUnreleased',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    };
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  getFabTokenBalanceOfABI(paramsArray: any) {
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': true,
      'inputs': [
        {
          'name': 'accountOwner',
          'type': 'address'
        }
      ],
      'name': 'balanceOf',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    };
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  getFabBalanceOfABI(paramsArray: any) {
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': true,
      'inputs': [
        {
          'name': 'accountOwner',
          'type': 'address'
        }
      ],
      'name': 'balanceOf',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    };
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  getFabTransferABI(paramsArray: any) {
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': 'to',
          'type': 'address'
        },
        {
          'name': 'value',
          'type': 'uint256'
        }
      ],
      'name': 'transfer',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  getKanbanLockerFuncABIAmountBig(coin: number, address: string, amountBig: BigNumber, lockPeriodOfBlockNumber: number) {
    const web3 = this.getWeb3Provider();
    let value = '0x' + amountBig.toString(16).split('.')[0];
    const id = this.hashKanbanMessage(address + coin + value + lockPeriodOfBlockNumber);
    const params = [id, address, coin, value, lockPeriodOfBlockNumber];

    const func = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_coinType",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_lockPeriodOfBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "lock",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const abiHex = this.getGeneralFunctionABI(func, params);

    return abiHex;  
  }

  getTransferFuncABIAmountBig(coin: number, address: string, amountBig: BigNumber) {
    const web3 = this.getWeb3Provider();
    let value = '0x' + amountBig.toString(16).split('.')[0];
    console.log('value for decimal=', value);
    const params = [address, coin, value, web3.utils.asciiToHex('')];

    const func = {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          "name": "_comment",
          "type": "bytes32"
        }
      ],
      'name': 'transfer',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };

    const abiHex = this.getGeneralFunctionABI(func, params);

    console.log('abiHex for transfer=', abiHex);
    return abiHex;    
  }

  hashKanbanMessage(data) {
    const web3 = this.getWeb3Provider();
    var messageHex = web3.utils.isHexStrict(data) ? data : web3.utils.utf8ToHex(data);
    var messageBytes = web3.utils.hexToBytes(messageHex);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x17Kanban Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    var hash = Hash.keccak256s(ethMessage);    
    console.log('hash1=', hash);
    return hash;
  }
  
  hashEtherumMessage(data) {
    const web3 = this.getWeb3Provider();
    var messageHex = web3.utils.isHexStrict(data) ? data : web3.utils.utf8ToHex(data);
    var messageBytes = web3.utils.hexToBytes(messageHex);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x19Ethereum Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    var hash = Hash.keccak256s(ethMessage);    
    console.log('hash1=', hash);
    return hash;
  }

  signKanbanMessageWithPrivateKey(message: string, privateKey: any) {
    var hash = this.hashKanbanMessage(message);
    return this.signKanbanMessageHashWithPrivateKey(hash, privateKey);
  }

  signKanbanMessageHashWithPrivateKey(hash: string, privateKey: any) {

    const privateKeyHex = `0x${privateKey.toString('hex')}`;
    // 64 hex characters + hex-prefix
    if (privateKeyHex.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }    
    var signature = Account.sign(hash, privateKeyHex);
    var vrs = Account.decodeSignature(signature);
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
  }
  
  toAscii(hex: string) {
    const web3 = this.getWeb3Provider();
    return web3.utils.toAscii(hex);
  }
  
  getTransferFuncABI(coin: number, address: string, amount: number) {
    const web3 = this.getWeb3Provider();
    let value = new BigNumber(amount).multipliedBy(new BigNumber(1e18)).toFixed();
    value = value.split('.')[0];
    
    const params = [address, coin, value, web3.utils.asciiToHex('')];

    const func = {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          "name": "_comment",
          "type": "bytes32"
        }
      ],
      'name': 'transfer',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };

    const abiHex = this.getGeneralFunctionABI(func, params);

    console.log('abiHex for transfer=', abiHex);
    return abiHex;
  }

  getUnlockFuncABI(id: string, user: string) {
    const web3 = this.getWeb3Provider();
    const func: any = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "unlock",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const abiHex = web3.eth.abi.encodeFunctionCall(func, [id,user]);
    return abiHex;
  }

  getDeleteOrderFuncABI(orderHash: string) {
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_orderHash',
          'type': 'bytes32'
        }
      ],
      'name': 'cancelOrder',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
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
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_fromContract',
          'type': 'bool'
        },        
        {
          'name': '_bid',
          'type': 'bool'
        },
        {
          'name': '_baseCoin',
          'type': 'uint32'
        },
        {
          'name': '_targetCoin',
          'type': 'uint32'
        },
        {
          'name': '_amount',
          'type': 'uint256'
        },
        {
          'name': '_price',
          'type': 'uint256'
        },
        {
          'name': '_orderHash',
          'type': 'bytes32'
        }
      ],
      'name': 'createOrder',
      'outputs': [
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  getFuncABI(func) {
    const web3 = this.getWeb3Provider();
    const abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);
    return abiHex;
  }


  getGeneralFunctionABI(func, paramsArray) {
    const web3 = this.getWeb3Provider();
    console.log('paramsArray==', paramsArray);
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  getWithdrawFuncABI(coinType: number, amount: BigNumber, destAddress: string, coinTypePrefix: any = null) {

    // let abiHex = '3a5b6c70';

    /*
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'withdraw',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    let abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);

    */

    let abiHex = '3295d51e';
    // console.log('abiHex there we go:' + abiHex);  
    if(coinTypePrefix) {
      abiHex += this.utilServ.fixedLengh(coinTypePrefix.toString(16), 56);
      abiHex += this.utilServ.fixedLengh(coinType.toString(16), 8);
    } else {
      abiHex += this.utilServ.fixedLengh(coinType.toString(16), 64);
    }
    
    // console.log('abiHex1=' + abiHex);

    const amountHex = amount.toString(16);
    // console.log('amount=' + amount);
    // console.log('amountHex=' + amountHex);
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    // console.log('abiHex2=' + abiHex);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(destAddress), 64);
    // console.log('abiHex final:' + abiHex);    
    return abiHex;
  }

  getDepositFuncABI(coinType: number, txHash: string, amount: BigNumber, addressInKanban: string, signedMessage: Signature, coinTypePrefix: any = null) {
    console.log('signedMessage==', signedMessage);
    let abiHex = '379eb862';
    abiHex += this.utilServ.stripHexPrefix(signedMessage.v);
    if(!coinTypePrefix) {
      abiHex += this.utilServ.fixedLengh(coinType.toString(16), 62);
    } else {
      abiHex += this.utilServ.fixedLengh(coinTypePrefix.toString(16), 54);
      abiHex += this.utilServ.fixedLengh(coinType.toString(16), 8);
    }
    
    abiHex += this.utilServ.stripHexPrefix(txHash);
    const amountHex = amount.toString(16);
    console.log('amountHex=', this.utilServ.fixedLengh(amountHex, 64));
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(addressInKanban), 64);
    abiHex += this.utilServ.stripHexPrefix(signedMessage.r);
    abiHex += this.utilServ.stripHexPrefix(signedMessage.s);

    return abiHex;

  }
}
