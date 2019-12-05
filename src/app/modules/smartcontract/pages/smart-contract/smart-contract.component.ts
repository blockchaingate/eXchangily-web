import { Component, OnInit, ViewChild } from '@angular/core';

import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import {MatSelectChange} from '@angular/material/select';
import { Wallet } from '../../../../models/wallet';
import { WalletService } from '../../../../services/wallet.service';
import { ApiService } from '../../../../services/api.service';
import { Web3Service } from '../../../../services/web3.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { AlertService } from '../../../../services/alert.service';
import * as Btc from 'bitcoinjs-lib';
import { MyCoin } from 'src/app/models/mycoin';
import {environment} from '../../../../../environments/environment';
@Component({
  selector: 'app-smart-contract',
  templateUrl: './smart-contract.component.html',
  styleUrls: ['./smart-contract.component.css']
})
export class SmartContractComponent implements OnInit {
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
  method: any;
  smartContractName: string;
  result: string;
  payableValue: number;
  selectedMethod: string;
  types = [];
  wallet: Wallet;
  smartContractAddress: string;
  mycoin: MyCoin;
  ABI = [];
  constructor(
    private walletService: WalletService, 
    private apiServ: ApiService, 
    private web3Serv: Web3Service,
    private utilServ: UtilService,
    private coinServ: CoinService,
    private alertServ: AlertService
    ) { 
    //this.ABI = this.getFunctionABI(this.ABI);
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
    this.smartContractAddress = environment.addresses.smartContract.FABLOCK;
    this.changeSmartContractAddress();
    this.wallet = await this.walletService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }  
    
    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin = this.wallet.mycoins[i];
      if (coin.name === 'FAB') {
        this.mycoin = coin;
        break;
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

  changeMethod(event: MatSelectChange) {
    console.log('val = ' + event.source.value);
    const val = event.source.value;
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
  async onConfirmedPin(pin: string) {

    const abiHex = this.formABI();
    console.log('this.wallet is:', this.wallet);
    console.log('pin is:', pin);
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.alertServ.openSnackBar('Your password is wrong.', 'Ok');
    }
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

    console.log('abiHex=', abiHex);
    console.log('this.smartContractAddress=', this.smartContractAddress);
    const contract = Btc.script.compile([
      84,
      this.utilServ.number2Buffer(gasLimit),
      this.utilServ.number2Buffer(gasPrice),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(abiHex)),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(this.smartContractAddress)),
      194
  ]);
  
    console.log('contract=', contract);
    const contractSize = contract.toJSON.toString().length;

    console.log('contractSize=' + contractSize);
    totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);


    const res = await this.coinServ.getFabTransactionHex(seed, this.mycoin, contract, value, totalFee, 14);
    
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
          this.result = errMsg;
        }
    }    
    /*
    const includeCoin = true;
    let value = 0;
    if (this.method.stateMutability === 'payable') {
      value = this.payableValue;
    }
    const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, includeCoin); 
    this.kanbanServ.sendRawSignedTransaction(txHex).subscribe((resp: TransactionResp) => {
      console.log('resp is:', resp);
      if (resp && resp.transactionHash) {
        this.result = 'txid-' + resp.transactionHash;
      }
    });
    */
  }
}
