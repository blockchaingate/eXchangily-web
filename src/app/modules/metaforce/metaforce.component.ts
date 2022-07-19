import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';
import { Web3Service } from 'src/app/services/web3.service';
import * as Btc from 'bitcoinjs-lib';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { PinNumberModal } from '../shared/modals/pin-number/pin-number.modal';
import { CoinService } from 'src/app/services/coin.service';
import { ApiService } from 'src/app/services/api.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-metaforce',
  templateUrl: './metaforce.component.html',
  styleUrls: ['./metaforce.component.css']
})
export class MetaforceComponent implements OnInit {
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
  coin = 'FAB';
  amount: number;
  mycoin: any;
  fabCoin: any;
  exgCoin: any;
  balance: number;

  wallet: any;
  result: string;
  error: any;
  stakeInfo = [];
  //abiHex: string;
  //value: number;

  constructor(
    private web3Serv: Web3Service,
    private utilServ: UtilService,
    private storageService: StorageService, 
    private coinServ: CoinService,
    private apiServ: ApiService,
    private alertServ: AlertService) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }  

    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin = this.wallet.mycoins[i];
      if ((coin.name === 'FAB') && !coin.tokenType && !coin.new) {
        console.log('coin===', coin);
        this.mycoin = coin;
        this.fabCoin = coin;
      } else 
      if(coin.name === 'EXG' && coin.tokenType == 'FAB' && !coin.new) {
        this.mycoin = coin;
        this.exgCoin = coin;
      }
    }  

    this.getStakeInfo();
  }


  getStakeInfo() {
    const address = this.utilServ.stripHexPrefix(environment.addresses.smartContract.StakingFABEXG);
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getStakeHashes",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    };

    const abiGetStakeInfo = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "getStakeInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "enum Staking.Type",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
    const owner = this.utilServ.fabToExgAddress(this.fabCoin.receiveAdds[0].address);
    const abiHex = this.utilServ.stripHexPrefix(this.web3Serv.getGeneralFunctionABI(
      abi, 
      [owner]));
    console.log('abiHex===', abiHex);
    this.apiServ.callFabSmartContract(address, abiHex, owner)
    .subscribe((res: any) => {
        //console.log('res=', res);
        if(res && res.executionResult) {
          const output = res.executionResult.output;
          if(output) {
            const hashes = this.web3Serv.decodeParameters(['bytes32[]'], output)[0];
            console.log('hashes[0]===', hashes[0]);
            console.log('hashes.length===', hashes.length);
            if(hashes && (hashes.length > 0)) {
              for(let i = 0; i < hashes.length; i++) {
                const hash = hashes[i];
                const abiHex2 = this.utilServ.stripHexPrefix(this.web3Serv.getGeneralFunctionABI(
                  abiGetStakeInfo, 
                  [hash]));

                  this.apiServ.callFabSmartContract(address, abiHex2, owner)
                  .subscribe((res2: any) => {
                      console.log('res2=', res2);
                      if(res2 && res2.executionResult) {
                        const output2 = res2.executionResult.output;
                        if(output2) {
                          const info = this.web3Serv.decodeParameters(
                            ['uint256', 'uint256', 'uint256', 'uint8'], 
                            output2);
                          console.log('info===', info);
                          const item = {
                            amount: info[0],
                            blocknumber1: info[1],
                            blocknumber2: info[2],
                            type: info[3]
                          }
                          this.stakeInfo.push(item);
                        }
                      }
                  });
              }
            }
          }
        }
    });
  }

  stake() {
    if(!this.mycoin) {
      this.alertServ.openSnackBar('Coin not available.', 'Ok');
      return;     
    }
    if(this.amount > this.mycoin.balance) {
      this.alertServ.openSnackBar('Not enough balance.', 'Ok');
      return;     
    }
    this.pinModal.show();

  }

  onConfirmedPin(pin: string) {
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.alertServ.openSnackBar('Your password is wrong.', 'Ok');
    }
    if(this.coin == 'FAB') {
      this.stakeFab(seed);
    } else 
    if(this.coin == 'EXG') {
      this.stakeExg(seed);
    }
  }

  async callFabContract(seed: Buffer, to: string, abiHex: string, value: number) {
    const gasLimit = 1000000;
    const gasPrice = 50;   

    const totalAmount = gasLimit * gasPrice / 1e8;
    // let cFee = 3000 / 1e8 // fee for the transaction

    let totalFee = totalAmount;

    let contract = Btc.script.compile([
      84,
      this.utilServ.number2Buffer(gasLimit),
      this.utilServ.number2Buffer(gasPrice),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(abiHex)),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(to)),
      194
    ]);   

    const contractSize = contract.toJSON.toString().length;
    totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

    console.log('this.mycoin==', this.mycoin);
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
    } else {
      console.log('error msg=', errMsg);
      this.error = errMsg;
    }
  }

  async stakeFab(seed: Buffer) {
    const abi = {
      "constant": false,
      "name": "depositFAB",
      "payable": false,
      "stateMutability": "payable",
      "type": "function",
      "inputs": [],
      "outputs": []
    };

    const abiHex = this.web3Serv.getGeneralFunctionABI(abi, []);

    //this.abiHex = abiHex;
    //this.value = this.amount;
    await this.callFabContract(seed, environment.addresses.smartContract.StakingFABEXG, abiHex, this.amount);

    /*
    
    */ 
  }

  async stakeExg(seed: Buffer) {
    let abi = {
      "constant": false,
      "name": "approve",
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ]
    }
    const amountHex = '0x' + new BigNumber(this.amount).shiftedBy(18).toString(16);
    let abiHex = this.web3Serv.getGeneralFunctionABI(abi, [environment.addresses.smartContract.StakingFABEXG, amountHex]);
    await this.callFabContract(seed, environment.addresses.smartContract.EXG.FAB, abiHex, 0);

    abi = {
      "constant": false,
      "name": "depositEXG",
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "outputs": []
    };
    abiHex = this.web3Serv.getGeneralFunctionABI(abi, [amountHex]);
    await this.callFabContract(seed, environment.addresses.smartContract.StakingFABEXG, abiHex, 0);
  } 

  changeCoin(coin) {
    this.coin = coin;
    if(coin == 'FAB') {
      this.mycoin = this.fabCoin;
    } else 
    if(coin == 'EXG'){
      this.mycoin = this.exgCoin;
    }
  }
}
