import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Pair } from 'src/app/config/pair';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { environment } from 'src/environments/environment';
import { Wallet } from '../../../../models/wallet';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertService } from 'src/app/services/alert.service';
import { MyCoin } from '../../../../models/mycoin';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import Common from 'ethereumjs-common';
import * as Eth from 'ethereumjs-tx';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.css']
})
export class PairComponent implements OnInit {
  @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
  kycContract: string = '0x0000000000000000000000000000000000000000';
  requiredKycLevel: number = 0;
  tradeFeePool: string = '';
  tokenLeft: string;
  tokenRight: string;
  priceDecimals: number;
  quantityDecimals: number;
  exgCoin: MyCoin;
  tokens: any;
  nonce: number = 0;
  wallet: Wallet | null;
  pairSmartContractAddress: string;
  constructor(private apiServ: ApiService,
    private storageService: StorageService,
    private utilServ: UtilService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    private alertServ: AlertService) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet();

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
    this.deployKanbanDo(seed);

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

  async registerPair(keyPairsKanban, blocknumber) {
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
      environment.chains.ETH.chain,
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      environment.chains.ETH.hardfork,
    );
    const tx = new Eth.Transaction(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');

    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
      (resp: any) => {
      if (resp && resp.transactionHash) {
        const txid = resp.transactionHash;
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

  async deployKanbanDo(seed) {
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

    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
      (resp: any) => {
        console.log('resp for deploy kanban==', resp);
      if (resp && resp.transactionHash) {
        const txid = resp.transactionHash;
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
                  this.alertServ.openSnackBar('Failed to create smart contract.', 'Ok');
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
  