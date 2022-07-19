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
import { TranslateService } from '@ngx-translate/core';

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
  hash: string;
  method: string;
  blockheight: number;
  //abiHex: string;
  //value: number;

  constructor(
    private web3Serv: Web3Service,
    private utilServ: UtilService,
    private storageService: StorageService, 
    private coinServ: CoinService,
    private apiServ: ApiService,
    private translateServ: TranslateService,
    private alertServ: AlertService) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar(
        this.translateServ.instant('No current wallet was found.'), 
        this.translateServ.instant('Ok'));
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


    const balanceObj = await this.coinServ.getBalance(this.fabCoin);
    this.balance = balanceObj.balance;

    this.getStakeInfo();

    this.apiServ.getFabBlockHeight().subscribe(
      (ret: any) => {
        this.blockheight = ret;
      }
    );
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
            if(hashes && (hashes.length > 0)) {
              for(let i = 0; i < hashes.length; i++) {
                const hash = hashes[i];
                const abiHex2 = this.utilServ.stripHexPrefix(this.web3Serv.getGeneralFunctionABI(
                  abiGetStakeInfo, 
                  [hash]));

                  this.apiServ.callFabSmartContract(address, abiHex2, owner)
                  .subscribe((res2: any) => {
                      if(res2 && res2.executionResult) {
                        const output2 = res2.executionResult.output;
                        if(output2) {
                          const info = this.web3Serv.decodeParameters(
                            ['uint256', 'uint256', 'uint256', 'uint8'], 
                            output2);
                          const item = {
                            hash,
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
    this.method = 'deposit';

    if(!this.mycoin) {
      this.alertServ.openSnackBar(
        this.translateServ.instant('Coin not available.'), 
        this.translateServ.instant('Ok'));
      return;     
    }
    
    if(this.amount > Number(this.mycoin.balance)) {
      this.alertServ.openSnackBar(
        this.translateServ.instant('Not enough balance.'), 
        this.translateServ.instant('Ok'));
      return;     
    }
    if((this.coin == 'FAB' && this.amount < 100) || (this.coin == 'EXG' && this.amount < 2000)) {
      this.alertServ.openSnackBar(
        this.translateServ.instant('Mininum amount required.'), 
        this.translateServ.instant('Ok'));
      return;          
    }
    this.pinModal.show();

  }

  onConfirmedPin(pin: string) {
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.alertServ.openSnackBar(
        this.translateServ.instant('Your password is wrong.'), 
        this.translateServ.instant('Ok'));
    }
    if(this.method == 'deposit') {
      if(this.coin == 'FAB') {
        this.stakeFab(seed);
      } else 
      if(this.coin == 'EXG') {
        this.stakeExg(seed);
      }
    } else 
    if(this.method == 'withdraw') {
      this.withdrawDo(seed);
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
    } else {
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
    const tos = [];
    let abiHex = this.web3Serv.getGeneralFunctionABI(abi, [environment.addresses.smartContract.StakingFABEXG, amountHex]);
    
    const gasLimit = 1000000;
    const gasPrice = 50;   

    const totalAmount = gasLimit * gasPrice / 1e8 * 2;
    // let cFee = 3000 / 1e8 // fee for the transaction

    let totalFee = totalAmount;

    let contract = Btc.script.compile([
      84,
      this.utilServ.number2Buffer(gasLimit),
      this.utilServ.number2Buffer(gasPrice),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(abiHex)),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(environment.addresses.smartContract.EXG.FAB)),
      194
    ]);  

    let contractSize = contract.toJSON.toString().length;
    totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

    tos.push( {
      address: contract,
      amount: 0
    });

    //await this.callFabContract(seed, environment.addresses.smartContract.EXG.FAB, abiHex, 0);

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

    contract = Btc.script.compile([
      84,
      this.utilServ.number2Buffer(gasLimit),
      this.utilServ.number2Buffer(gasPrice),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(abiHex)),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(environment.addresses.smartContract.StakingFABEXG)),
      194
    ]);  

    contractSize = contract.toJSON.toString().length;
    totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

    tos.push( {
      address: contract,
      amount: 0
    });

    const keyPair = this.coinServ.getKeyPairs(this.mycoin, seed, 0, 0);
    const address = this.mycoin.receiveAdds[0].address;

    const satoshisPerBytes = 100;
    const bytesPerInput = 150;

    let { txHex, errMsg, transFee } = await this.coinServ.getFabTransactionHexMultiTos(keyPair.privateKey, address, tos, totalFee,
      satoshisPerBytes, bytesPerInput);

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
      } else {
        this.error = errMsg;
      }      
    //await this.callFabContract(seed, environment.addresses.smartContract.StakingFABEXG, abiHex, 0);
  } 

  async changeCoin(coin) {
    this.coin = coin;
    if(coin == 'FAB') {
      this.mycoin = this.fabCoin;
    } else 
    if(coin == 'EXG'){
      this.mycoin = this.exgCoin;
    }

    const balanceObj = await this.coinServ.getBalance(this.mycoin);
    this.balance = balanceObj.balance;
  }

  withdraw(hash: string) {
    this.method = 'withdraw';
    this.hash = hash;
    this.pinModal.show();
    
  }

  async withdrawDo(seed) {
    const abi = {
      "constant": false,
      "name": "withdraw",
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [
        {
          "name": "_stakeHash",
          "type": "bytes32"
        }
      ],
      "outputs": []
    };
    let abiHex = this.web3Serv.getGeneralFunctionABI(abi, [this.hash]);
    await this.callFabContract(seed, environment.addresses.smartContract.StakingFABEXG, abiHex, 0);
  }

  getAmount(item) {
    let decimals = 8;
    if(item.type == 2) {
      decimals = 18;
    }
    return new BigNumber(item.amount).shiftedBy(-decimals).toNumber();
  }

  getCoin(coinType) {
    if(coinType == 1) {
      return 'FAB';
    }
    return 'EXG';
  }

  gettxid(txid: string) {
    const baseUrl = environment.production ? 'https://fabexplorer.com/' : 'https://fabtest.info/';
    return baseUrl + '#/search/' + txid;
  }

  withdrawable(blocknumber2) {

    if(Number(blocknumber2) <= Number(this.blockheight)) {
      return true;
    }
    return false;
  }
  
}
