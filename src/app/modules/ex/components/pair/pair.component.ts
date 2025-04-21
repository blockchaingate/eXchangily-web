import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Pair } from '../../../../config/pair';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { environment } from '../../../../../environments/environment';
import { Wallet } from '../../../../models/wallet';
import { StorageService } from '../../../../services/storage.service';
import { UtilService } from '../../../../services/util.service';
import { AlertService } from '../../../../services/alert.service';
import { MyCoin } from '../../../../models/mycoin';
import { CoinService } from '../../../../services/coin.service';
import { KanbanService } from '../../../../services/kanban.service';
import Common from 'ethereumjs-common';
import * as Eth from 'ethereumjs-tx';
import { Web3Service } from '../../../../services/web3.service';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.css']
})
export class PairComponent implements OnInit {
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal = {} as PinNumberModal;
  kycContract: string = '0x0000000000000000000000000000000000000000';
  requiredKycLevel: number = 0;
  tradeFeePool: string = '';
  tokenLeft = '';
  tokenRight = '';
  priceDecimals = 2;
  quantityDecimals = 2;
  exgCoin: MyCoin = {} as MyCoin;
  tokens: any;
  nonce: number = 0;
  wallet: Wallet = {} as Wallet;
  pairSmartContractAddress = '';

  constructor(private apiServ: ApiService,
    private storageService: StorageService,
    private utilServ: UtilService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    private alertServ: AlertService) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet() as Wallet;

    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin = this.wallet.mycoins[i];
      if(coin.name === 'EXG' && coin.tokenType == 'FAB') {
        this.exgCoin = coin;
        this.tradeFeePool = this.utilServ.fabToExgAddress(coin.receiveAdds[0].address);
      }
    }  

    this.apiServ.getKanbanTokens().subscribe(
      (tokens: any) => {
        this.tokens = tokens;
      }
    );
  }

  submit() {
    this.pinModal.show();
  }

  onConfirmedPin(pin: string) {
    if(!this.tradeFeePool || (this.tradeFeePool == '0x0000000000000000000000000000000000000000')) {
      return this.alertServ.openSnackBar('tradeFeePool need to be set.', 'Ok');
    }
    const seed = this.utilServ.aesDecryptSeed(this.wallet?.encryptedSeed, pin);
    if (!seed) {
      this.alertServ.openSnackBar('Your password is wrong.', 'Ok');
    }
    if (seed) {
      this.deployKanbanDo(seed);
    } else {
      this.alertServ.openSnackBar('Seed is null. Cannot proceed.', 'Ok');
    }

  }

  formCreateKanbanSmartContractABI() {
    const abi = Pair.ABI;
    const args = [
      environment.addresses.smartContract.ExchangilyFactory,
      this.kycContract,
      this.requiredKycLevel,
      this.tokenLeft,
      this.tokenRight,
      this.tradeFeePool
    ];
    return this.web3Serv.formCreateSmartContractABI(abi, Pair.bytecode.trim(), args);
 
  }

  async registerPair(keyPairsKanban: any, blocknumber: number) {
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_pairAddr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_startBlock",
          "type": "uint256"
        }
      ],
      "name": "registerTradingPair",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.tokenLeft,
      this.tokenRight,
      this.pairSmartContractAddress,
      blocknumber
    ];
    const kanbanData = this.web3Serv.getGeneralFunctionABI(abi, args);
    
    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    const nonce = this.nonce;

    const txObject = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        to: environment.addresses.smartContract.ExchangilyFactory,
        data: kanbanData         
    };

    const privKey = keyPairsKanban.privateKeyBuffer ? keyPairsKanban.privateKeyBuffer.privateKey
    :
    Buffer.from(keyPairsKanban.privateKeyHex, 'hex');

    let txhex = '';

    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      'petersburg',
    );

    const tx = new Eth.Transaction(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');

    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
      (resp: any) => {
        console.log('resp====', resp);
      if (resp && resp.txid) {
        const txid = resp.txid;
        this.alertServ.openSnackBarSuccess('Smart contract was called successfully.', 'Ok');
        this.kanbanServ.createPairDecimals(this.tokenLeft, this.tokenRight, this.priceDecimals, this.quantityDecimals).subscribe(
          (ret: any) => {
            console.log('ret for createPairDecimals=', ret);
          }
        );
      } else {
        this.alertServ.openSnackBar('Failed to call smart contract.', 'Ok');
      }
    },
    error => {
      this.alertServ.openSnackBar(error.error, 'Ok');
    }
    );
  }

  async deployKanbanDo(seed: Buffer) {
    const keyPairsKanban = this.coinServ.getKeyPairs(this.exgCoin, seed, 0, 0);
    // const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = 8000000;
    const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

    this.nonce = nonce + 1;
    //let kanbanTo = '0x0000000000000000000000000000000000000000';

    let kanbanValue = 0;

    const kanbanData = this.formCreateKanbanSmartContractABI();
    const txObject = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        //to: kanbanTo,
        value: kanbanValue,
        data: '0x' + this.utilServ.stripHexPrefix(kanbanData)          
    };

    let privKey: any = keyPairsKanban.privateKeyBuffer;

    if(!Buffer.isBuffer(privKey)) {
      privKey = privKey.privateKey;
    }
    
    let txhex = '';

    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      'petersburg'
    );
    let tx = new Eth.Transaction(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');

    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
      (resp: any) => {
        console.log('resp for deploy kanban==', resp);
      if (resp && resp.txid) {
        const txid = resp.txid;
        //this.alertServ.openSnackBarSuccess('Smart contract was created successfully.', 'Ok');

        var that = this;
        var myInterval = setInterval(function(){ 
          that.kanbanServ.getTransactionReceipt(txid).subscribe(
            (res: any) => {
              if(res && res.transactionReceipt) {
                clearInterval(myInterval);
                const receipt = res.transactionReceipt;
                if(receipt.status == '0x1') {
                  if(res.transactionReceipt.contractAddress) {
                    that.pairSmartContractAddress = res.transactionReceipt.contractAddress;
  
                    that.kanbanServ.getLatestBlocksMetainfo().subscribe(
                      (ret: any) => {
                        console.log('ret for latest info===', ret);
                        if(ret && ret.length > 0) {
                          const block = ret[0];
                          let blocknumber = block.number;
                          blocknumber = blocknumber + 30;
                          that.registerPair(keyPairsKanban, blocknumber);
                        }
                      }
                    );
                  }
                } else {
                  // this.alertServ.openSnackBar('Failed to create smart contract.', 'Ok');
                }

              }
            }
          );
        }, 1000);
      } else {
        this.alertServ.openSnackBar('Failed to create smart contract.', 'Ok');
      }
    },
    error => {
      this.alertServ.openSnackBar(error.error, 'Ok');
    }
    );
  }
}
  