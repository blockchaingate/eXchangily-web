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
  smartContractName: string;
  result: string;
  error: string;
  ethData: string;
  kanbanTo: string;
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

  changeSmartContractAddress() {
    console.log('currentAddress=' + this.smartContractAddress);
    if (this.smartContractAddress) {
      this.apiServ.getSmartContractABI(this.smartContractAddress).subscribe((res: any) => {
        console.log('res=', res);
        if (res && res.abi) {
          this.ABI = this.getFunctionABI(res.abi);
          this.smartContractName = res.Name;
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
        console.log('type=' + type);
        if (this.types.includes(type)) {
          continue;
        }
        console.log('added it.');
        this.types.push(type);
      }
    }
    return retABI;
  }

  async ngOnInit() {
    this.action = '';
    this.smartContractAddress = environment.addresses.smartContract.FABLOCK;
    this.changeSmartContractAddress();
    this.wallet = await this.storageService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }  
    
    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin = this.wallet.mycoins[i];
      if (coin.name === 'FAB') {
        this.mycoin = coin;
        this.balance = await this.coinServ.getBalance(coin);
        console.log('this.balance=', this.balance);
        // break;
      } else 
      if (coin.name === 'ETH') {
        this.ethCoin = coin;
        this.ethBalance = await this.coinServ.getBalance(coin);        
      }
      if(coin.name === 'EXG') {
        this.exgCoin = coin;
      }
    }  
    
    if (!this.mycoin) {
      this.alertServ.openSnackBar('no fab coin found for this wallet.', 'Ok');
      return;
    }    
  }

  getMethodDefinition = (json, method) => {
  
    return json.find(({ type, name }) => (
      name === method && type === 'function'
    ));
  }

  changeMethod(val: string) {
    this.renderMethod(val);
  }

  
  renderMethod(method: string) {

    const def = this.getMethodDefinition(this.ABI, method);
    console.log('def=', def);
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
      const val = input.val;
      vals.push(val);
    } 

    const abi = this.web3Serv.getGeneralFunctionABI(this.method, vals);
    /*
    console.log('functionSig=', abi);
    for (let i = 0; i < this.method.inputs.length; i++) {
      const input = this.method.inputs[i];
      const val = input.val;
      console.log('val=' + val);
      if (input.type) {
        if (input.type.toLower() === 'address') {

        } else {

        }
      }
    }
    */
    return abi;
  }

  async deployEthDo(seed) {

    const keyPair = this.coinServ.getKeyPairs(this.ethCoin, seed, 0, 0);
    const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
    console.log('this.ethData = ', this.ethData);
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

  async callFabSmartContract(seed) {
    const abiHex = this.formABI();
    const gasLimit = 800000;
    const gasPrice = 40;
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
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(this.smartContractAddress)),
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
        errMsg = res2.errMsg;
        if (txHash) {
          this.result = txHash;
        } else 
        if (errMsg) {
          this.error = errMsg;
        }
    }  
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
    }
  }

  deployEth() {
    this.action = 'deployEth';
    //console.log('this.ethData==', this.ethData);
    this.pinModal.show(); 
  }

  callKanban() {
    this.action = 'callKanban';
    this.pinModal.show(); 
  }
}
