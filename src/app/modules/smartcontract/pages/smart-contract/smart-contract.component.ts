import { Component, OnInit, ViewChild } from '@angular/core';

import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { Wallet } from '../../../../models/wallet';
import { StorageService } from '../../../../services/storage.service';
import { ApiService } from '../../../../services/api.service';
import { Web3Service } from '../../../../services/web3.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { AlertService } from '../../../../services/alert.service';
import * as Btc from 'bitcoinjs-lib';
import { KanbanService } from '../../../../services/kanban.service';
import { MyCoin } from '../../../../models/mycoin';
import {environment} from '../../../../../environments/environment';
import { TransactionResp } from '../../../../interfaces/kanban.interface';
import Common from 'ethereumjs-common';
import KanbanTxService from '../../../../services/kanban.tx.service';

@Component({
  selector: 'app-smart-contract',
  templateUrl: './smart-contract.component.html',
  styleUrls: ['./smart-contract.component.css']
})
export class SmartContractComponent implements OnInit {
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
  method: any;
  action: string;
  abiName: string;
  contractName: string;
  smartContractName: string;
  result: string;
  error: string;
  fabABI: string;
  fabBytecode: string;
  fabArguments: string;

  ethABI: string;
  ethBytecode: string;
  ethArguments: string;  

  kanbanABI: string;
  kanbanBytecode: string;
  kanbanArguments: string;  

  ethData: string;
  lockerHashes: any;
  kanbanTo: string;
  gasPrice: number;
  gasLimit: number;
  kanbanValue: number;
  kanbanData: string;
  payableValue: number;
  selectedMethod: string;
  types = [];
  wallet: Wallet;
  smartContractAddress: string;
  mycoin: MyCoin;
  ethCoin: MyCoin;
  exgCoin: MyCoin;
  balance: any;
  ethBalance: any;
  contractNames = [
    'EXG',
    'DSC',
    'BST',
    'Deploy',
    'Fab Lock For EXG Airdrop'
  ];
  ABI = [];
  constructor(
    private storageService: StorageService, 
    private apiServ: ApiService, 
    private web3Serv: Web3Service,
    private utilServ: UtilService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private alertServ: AlertService
    ) { 
    // this.ABI = this.getFunctionABI(this.ABI);
  }

  changeContractName(name:string) {
    console.log('change contract name:', name);
    this.contractName=name;
    if(name === 'Fab Lock For EXG Airdrop') {
      this.smartContractAddress =  environment.addresses.smartContract.FABLOCK;
    } else
    if(name === 'Deploy') {
      this.smartContractAddress = '0x0';
    } else {
      this.smartContractAddress = environment.addresses.smartContract[name].FAB;
    }

    this.changeSmartContractAddress();
  }
  changeSmartContractAddress() {
    /*
    if (this.smartContractAddress == environment.addresses.smartContract.FABLOCK) {
      this.apiServ.getSmartContractABI(this.smartContractAddress).subscribe((res: any) => {
        console.log('res=', res);
        if (res && res.abi) {
          this.ABI = this.getFunctionABI(res.abi);
          if(this.ABI && this.ABI.length > 0) {
            this.changeMethod(this.ABI[0].name);
          }
          
        }
      });
      
    } else 
    if(this.smartContractAddress == environment.addresses.smartContract.EXG.FAB) {
      this.ABI = [
        {
          "constant": false,
          "inputs": [
              {
                  "name": "_lockerHash",
                  "type": "bytes32"
              }
          ],
          "name": "unlockByLockerHash",
          "outputs": [
              {
                  "name": "",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
      },
        {
          "constant": false,
          "inputs": [
              {
                  "name": "_account",
                  "type": "address"
              }
          ],
          "name": "unlockByAccount",
          "outputs": [
              {
                  "name": "",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }         
      ];
      this.changeMethod('unlockByLockerHash');
    } else 
    */
    if(this.smartContractAddress === '0x0') {
      this.changeMethod('');
    } else {
      this.apiServ.getSmartContractABI(this.smartContractAddress).subscribe((res: any) => {
        if (res && res.abi) {
          this.ABI = this.getFunctionABI(res.abi);
          if(this.ABI && this.ABI.length > 0) {
            if(this.smartContractAddress == environment.addresses.smartContract.EXG.FAB) {
              this.changeMethod('unlockByLockerHash');
            } else {
              this.changeMethod(this.ABI[0].name);
            }
            
          }
        }
      });      
    }
  }

  getFunctionABI(ABI: any) {
    const retABI = ABI.filter((abi) => abi.type === 'function');
    for (let i = 0; i < retABI.length; i++) {
      const item = retABI[i];
      for (let j = 0; j < item.inputs.length; j ++) {
        const input = item.inputs[j];
        const type = input.type;
        if (this.types.includes(type)) {
          continue;
        }
        this.types.push(type);
      }
    }
    return retABI;
  }

  async ngOnInit() {
    this.action = '';
    this.lockerHashes = [];
    this.gasLimit = 1000000;
    this.gasPrice = 50;    
    //this.smartContractAddress = environment.addresses.smartContract.FABLOCK;
    //this.changeSmartContractAddress();
    this.wallet = await this.storageService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }  
    
    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin = this.wallet.mycoins[i];
      if ((coin.name === 'FAB') && !coin.tokenType && !this.balance) {
        this.mycoin = coin;
        this.balance = await this.coinServ.getBalance(coin);
        console.log('this.balance=', this.balance);
        // break;
      } else 
      if (coin.name === 'ETH') {
        this.ethCoin = coin;
        try {
          this.ethBalance = await this.coinServ.getBalance(coin);  
        } catch(e) {

        }
              
      }
      if(coin.name === 'EXG') {
        this.exgCoin = coin;
      }
    }  
    

    if (!this.mycoin) {
      this.alertServ.openSnackBar('no fab coin found for this wallet.', 'Ok');
      return;
    }  
    
    const fabAddress = this.mycoin.receiveAdds[0].address;

    this.apiServ.getEXGLockerDetail(fabAddress).subscribe(
      (ret:any) => {
        if(ret.success) {
          if(ret.data && (ret.data.length > 0)) {
            console.log('ret.data==', ret.data);
            this.lockerHashes = ret.data;
            console.log('this.lockerHashes==', this.lockerHashes);
            console.log(this.lockerHashes.length);
          }
          
        }
      }
    );
    this.changeContractName('EXG');
  }

  getMethodDefinition = (json, method) => {
  
    return json.find(({ type, name }) => (
      name === method && type === 'function'
    ));
  }

  changeMethod(val: string) {
    this.abiName = val;
    this.renderMethod(val);
  }

  
  renderMethod(method: string) {

    const def = this.getMethodDefinition(this.ABI, method);
    console.log('def===', def);
    if(!def) {
      return;
    }
    const inputs = def.inputs;
    if(inputs && inputs.length > 0) {
      for(let i=0;i<inputs.length;i++) {
        const input = inputs[i];
        if(input.name === '_account' && input.type==='address' && this.smartContractAddress === environment.addresses.smartContract.EXG.FAB) {
          input.val = this.exgCoin.receiveAdds[0].address;
          if(!input.val.startsWith('0x')) {
            input.val = this.utilServ.fabToExgAddress(input.val);
          }
          console.log('input.val===', input.val);
        }      
      }
    }


    this.method = def;
    /*
    console.log('def=', def);
    if (canRenderMethodParams(this.ABI, method)) {
      renderMethodParams(this.ABI, method, (name, instance) => {
        console.log('name=', name);
        console.log('instance=', instance);
        switch (instance.fieldType()) {
          case FIELD_TYPES.NUMBER: {
            console.log('FIELD_TYPEcoinServ
            break;
          }
          case FIELD_TYPES.ADDRESS:coinServ
            // ...
            console.log('FIELD_TYPES.ADDRESS');
            break;
          // ...
        }
      });
    }
    */
  }

  callContract() {
    const address = this.utilServ.stripHexPrefix(this.smartContractAddress);
    const abiHex = this.utilServ.stripHexPrefix(this.formABI());


    const sender = this.mycoin.receiveAdds[0].address;

    if (!sender) {
      this.alertServ.openSnackBar('address was not found.', 'Ok');
      return;
    }
    this.apiServ.callFabSmartContract(address, abiHex, sender).subscribe((res: any) => {
      console.log('res=', res);
      this.payableValue = 0;
      this.result = res;
    });
  }
  async submit() {
    
    if (this.method.stateMutability === 'view') {
      this.callContract();
    } else {
      if (Number(this.payableValue) > this.balance.balance) {
        this.alertServ.openSnackBar('not enough amount.', 'Ok');
        return;
      }
      await this.pinModal.show(); 
    }
  }

  formABI() {
    const vals = [];
    for (let i = 0; i < this.method.inputs.length; i++) {
      const input = this.method.inputs[i];
      let val = input.val;
      if(!val) {
        val = '0x0000000000000000000000000000000000000000000000000000000000000000';
      }
      vals.push(val);
    } 

    const abi = this.web3Serv.getGeneralFunctionABI(this.method, vals);

    return abi;
  }

  async deployEthDo(seed) {

    const keyPair = this.coinServ.getKeyPairs(this.ethCoin, seed, 0, 0);
    const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
    console.log('this.ethData = ', this.ethData);

    this.ethData = this.formCreateEthSmartContractABI();
    const txParams = {
        nonce: nonce,
        gasPrice: 100000000000,
        gasLimit: 8000000,
        value: 0,
        data: this.ethData          
    };

    // console.log('txParams=', txParams);
    const txHex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);


    const retEth = await this.apiServ.postEthTx(txHex);   

    console.log('retEth===', retEth);
    if(retEth && retEth.txHash) {
      this.alertServ.openSnackBarSuccess('Smart contract was deploy successfully.', 'Ok');
    }

  }

  async deployKanbanDo(seed) {
    const keyPairsKanban = this.coinServ.getKeyPairs(this.exgCoin, seed, 0, 0);
    // const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = 8000000;
    const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

    let kanbanTo = '0x0000000000000000000000000000000000000000';

    let kanbanValue = 0;

    const kanbanData = this.formCreateKanbanSmartContractABI();
    const txObject = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        to: kanbanTo,
        value: kanbanValue,
        data: '0x' + this.utilServ.stripHexPrefix(kanbanData)          
    };

    let privKey: any = keyPairsKanban.privateKeyBuffer;

    if(!Buffer.isBuffer(privKey)) {
      privKey = privKey.privateKey;
    }
    
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
    const tx = new KanbanTxService(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');

    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
      (resp: TransactionResp) => {
      if (resp && resp.transactionHash) {
        this.result = 'txid:' + resp.transactionHash;
        this.alertServ.openSnackBarSuccess('Smart contract was created successfully.', 'Ok');
      } else {
        this.alertServ.openSnackBar('Failed to create smart contract.', 'Ok');
      }
    },
    error => {
      this.alertServ.openSnackBar(error.error, 'Ok');
    }
    );
    /*
    const keyPair = this.coinServ.getKeyPairs(this.ethCoin, seed, 0, 0);
    const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
    console.log('this.ethData = ', this.ethData);

    this.ethData = this.formCreateEthSmartContractABI();
    const txParams = {
        nonce: nonce,
        gasPrice: 100000000000,
        gasLimit: 8000000,
        value: 0,
        data: this.ethData          
    };

    // console.log('txParams=', txParams);
    const txHex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);


    const retEth = await this.apiServ.postEthTx(txHex);   

    console.log('retEth===', retEth);
    if(retEth && retEth.txHash) {
      this.alertServ.openSnackBarSuccess('Smart contract was deploy successfully.', 'Ok');
    }
    */
  }

  async callKanbanDo(seed) {

    const keyPairsKanban = this.coinServ.getKeyPairs(this.exgCoin, seed, 0, 0);
    // const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

    let kanbanTo = '0x0000000000000000000000000000000000000000';
    if(this.kanbanTo) {
      kanbanTo = this.kanbanTo;
    }

    let kanbanValue = 0;
    if(this.kanbanValue) {
      kanbanValue = this.kanbanValue;
    }
    console.log(this.kanbanTo);
    const txObject = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        to: kanbanTo,
        value: kanbanValue,
        data: '0x' + this.utilServ.stripHexPrefix(this.kanbanData)          
    };

    const privKey = Buffer.from(keyPairsKanban.privateKeyHex, 'hex');

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
    const tx = new KanbanTxService(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');

    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
      (resp: TransactionResp) => {
      if (resp && resp.transactionHash) {
        this.alertServ.openSnackBarSuccess('Smart contract was called successfully.', 'Ok');
      } else {
        this.alertServ.openSnackBar('Failed to call smart contract.', 'Ok');
      }
    },
    error => {
      this.alertServ.openSnackBar(error.error, 'Ok');
    }
    );

  }

  formCreateSmartContractABI() {
    const abi = JSON.parse(this.fabABI);
    let args = [];
    if(this.fabArguments) {
      args = this.fabArguments.split(',').map(item => {return item.trim()});
    }
    return this.web3Serv.formCreateSmartContractABI(abi, this.fabBytecode.trim(), args);
 
  }

  formCreateEthSmartContractABI() {
    const abi = JSON.parse(this.ethABI);
    let args = [];
    if(this.ethArguments) {
      args = this.ethArguments.split(',').map(item => {return item.trim()});
    }
    return this.web3Serv.formCreateSmartContractABI(abi, this.ethBytecode.trim(), args);
 
  }

  formCreateKanbanSmartContractABI() {
    const abi = JSON.parse(this.kanbanABI);
    let args = [];
    if(this.kanbanArguments) {
      args = this.kanbanArguments.split(',').map(item => {return item.trim()});
    }
    return this.web3Serv.formCreateSmartContractABI(abi, this.kanbanBytecode.trim(), args);
 
  }

  async callFabSmartContract(seed) {
    let abiHex = '';
    let smartContractAddress = this.smartContractAddress;
    if(smartContractAddress == '0x0') {
      abiHex = this.formCreateSmartContractABI();
      console.log('abiHex for smart contract:', abiHex);
      smartContractAddress = null;
    } else {
      abiHex = this.formABI();
    }
    
    const gasLimit = this.gasLimit;
    const gasPrice = this.gasPrice;
    let value = 0;
    if (this.method.stateMutability === 'payable') {
      value = Number(this.payableValue);
    }
    console.log('value=', value);
    const totalAmount = gasLimit * gasPrice / 1e8;
    // let cFee = 3000 / 1e8 // fee for the transaction

    let totalFee = totalAmount;

    const contract = Btc.script.compile([
      84,
      this.utilServ.number2Buffer(gasLimit),
      this.utilServ.number2Buffer(gasPrice),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(abiHex)),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(smartContractAddress)),
      194
    ]);
  
    const contractSize = contract.toJSON.toString().length;
    totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

    this.mycoin.tokenType = 'FAB';
    const res = await this.coinServ.getFabTransactionHex(seed, this.mycoin, contract, value, 
      totalFee, environment.chains.FAB.satoshisPerBytes, environment.chains.FAB.bytesPerInput, false);
    
    const txHex = res.txHex;
    let errMsg = res.errMsg;
    let txHash = '';
    if (!errMsg) {
        const res2 = await this.apiServ.postFabTx(txHex);
        txHash = res2.txHash;
        console.log('txHashtxHash=', txHash);
        errMsg = res2.errMsg;
        if (txHash) {
          this.result = txHash;
        } else 
        if (errMsg) {
          this.error = errMsg;
        }
    }  
  }

  deployKanban() {
    this.action = 'deployKanban';
    this.pinModal.show(); 
  }

  async onConfirmedPin(pin: string) {

    
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.alertServ.openSnackBar('Your password is wrong.', 'Ok');
    }

    if(!this.action || (this.action == '')) {
      await this.callFabSmartContract(seed);
    } else 
    if(this.action == 'deployEth') {
      await this.deployEthDo(seed);
    } else
    if(this.action == 'callKanban') {
      await this.callKanbanDo(seed);
    } else
    if(this.action == 'deployKanban') {
      await this.deployKanbanDo(seed);
    }
  }

  deployEth() {
    this.action = 'deployEth';
    this.pinModal.show(); 
  }

  callKanban() {
    this.action = 'callKanban';
    this.pinModal.show(); 
  }
}
