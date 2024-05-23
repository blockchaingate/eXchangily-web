import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { PinNumberModal } from '../shared/modals/pin-number/pin-number.modal';
import * as Btc from 'bitcoinjs-lib';
import { Web3Service } from 'src/app/services/web3.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertService } from 'src/app/services/alert.service';
import { CoinService } from 'src/app/services/coin.service';
import { MyCoin } from '../../models/mycoin';
import { environment } from 'src/environments/environment';
import { FRC20 } from '../../config/frc20';
import { ApiService } from 'src/app/services/api.service';
import { IssueToken } from '../../interfaces/fab.interface';
import { TranslateService } from '@ngx-translate/core';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-issue-token',
  templateUrl: './issue-token.component.html',
  styleUrls: ['./issue-token.component.scss'],
  providers: [CoinService]
})

export class IssueTokenComponent implements OnInit {
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

  totalSupply: number;
  file: any;
  name: string;
  symbol: string;
  decimals: number;
  wallet: any;
  totalFee: number = 200;
  txHash: string;
  errMsg: string;
  mycoin: MyCoin;
  balance: number;
  txs: IssueToken[];
  address: string;

  constructor(
    private utilServ: UtilService,
    private storageService: StorageService,
    private alertServ: AlertService,
    private apiServ: ApiService,
    private translateServ: TranslateService,
    private coinServ: CoinService,
    private web3Serv: Web3Service) { }

  async ngOnInit() {

    this.wallet = await this.storageService.getCurrentWallet();

    if (!this.wallet) {
      this.alertServ.openSnackBar('No current wallet was found.', 'Ok');
      return;
    }

    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin: MyCoin = this.wallet.mycoins[i];
      if ((coin.name === 'FAB') && (coin.tokenType != 'ETH') && !coin.new) {
        this.mycoin = coin;
        //const { balance, lockbalance } = await this.coinServ.getBalance(coin);
        this.balance = coin.balance;
        this.address = this.mycoin.receiveAdds[0].address;
        break;
      }
    }
    this.txs = [];
    this.apiServ.getIssueTokensOwnedBy(this.address).subscribe(
      (ret: any) => {
        for(let i = 0; i < ret.length; i++) {
          const item = ret[i];
          item.smartContractAddress = item.tokenId;
          this.txs.push(item);
        }



        this.storageService.getIssueTokenTransactions().subscribe(
          async (res: IssueToken[]) => {
    
            if (res) {
              for(let j = 0; j < res.length; j++) {
                const itemInStorage = res[j];
                let existed = false;
                for(let i = 0; i < this.txs.length; i++) {
                  if(this.txs[i].txid ==  itemInStorage.txid) {
                    existed = true;
                    break;
                  }
                }
                if(!existed) {
                  this.txs.push(itemInStorage);
                }
              }             
              /*
              this.txs = res;
              let updated = false;
              for (let i = 0; i < this.txs.length; i++) {
                const tx = this.txs[i];
                if (tx.status == 'pending') {
                  const txid = tx.txid;
                  const receipts: any = await this.coinServ.getFabTransactionReceipt(txid);
                  console.log('receipts==', receipts);
                  if (receipts && receipts.length > 0) {
                    const receipt = receipts[0];
                    if (receipt.contractAddress) {
                      tx.status = 'confirmed';
                      tx.smartContractAddress = receipt.contractAddress;
                    } else {
                      tx.status = 'failed';
                    }
                    updated = true;
                  }
                }
    
                if (updated) {
                  this.storageService.storeIssueTokenTransactions(this.txs);
                }
              }
              */
            }
          }
        );

      }
    );

  }

  confirm() {
    if (!this.totalSupply || !this.name || !this.symbol || !this.decimals) {

      return;
    }
    if (this.balance < this.totalFee) {
      this.alertServ.openSnackBar(this.translateServ.instant('Not enough balance'), this.translateServ.instant('Ok'));
    }

    this.pinModal.show();
  }

  async onConfirmedPin(pin: string) {
    var satoshisPerBytes = 100;
    var bytesPerInput = 150;

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if(!seed) {
      console.log('this.wallet===', this.wallet);
      console.log('this.wallet.encryptedSeed===', this.wallet.encryptedSeed);
      console.log('pin====', pin);
      return this.alertServ.openSnackBar('Invalid password', this.translateServ.instant('Ok'));
    }
    const { contract, totalFee } = this.deployFabSmartContract();

    const tos = [
      {
        address: environment.IssueTokenReceipt,
        amount: this.totalFee - 2
      },
      {
        address: contract,
        amount: 0
      }
    ];

    console.log('this.mycoin=', this.mycoin);
    //console.log('SEED=', seed);
    const keyPair = this.coinServ.getKeyPairs(this.mycoin, seed, 0, 0);
    if(!keyPair || !keyPair.privateKey) {
      console.log('seed===', seed);
      return this.alertServ.openSnackBar('Cannot get private key', this.translateServ.instant('Ok'));
    }
    const { txHex, errMsg, transFee } = await this.coinServ.getFabTransactionHexMultiTos(keyPair.privateKey, this.address, tos, totalFee,
      satoshisPerBytes, bytesPerInput);

    if (txHex) {
      const data = {
        owner: this.address,
        totalSupply: this.totalSupply,
        logo: this.file,
        name: this.name,
        symbol: this.symbol,
        decimals: this.decimals,
        txhex: txHex
      }
      this.apiServ.issueToken(data).subscribe(
        (ret: any) => {
          console.log('ret===', ret);
          if(ret && ret.txid) {
            const tx: IssueToken = {
              txid: ret.txid,
              status: 'pending',
              address: this.address,
              smartContractAddress: '',
              name: this.name,
              symbol: this.symbol,
              totalSupply: this.totalSupply,
              decimals: this.decimals
            };
            this.storageService.addIssueTokenTransaction(tx);
            this.txs.push(tx);
            this.alertServ.openSnackBar(this.translateServ.instant('Your transaction was submitted.'), this.translateServ.instant('Ok'));
          }
          else {
            this.alertServ.openSnackBar(this.translateServ.instant('Failed to issue new token.'), this.translateServ.instant('Ok'));
          }
        }
      );

    } else
      if (errMsg) {
        this.alertServ.openSnackBar(errMsg, this.translateServ.instant('Ok'));
        //this.errMsg = errMsg;
      }
  }

  formCreateSmartContractABI() {
    let abi = FRC20.ABI;
    const fabBytecode = FRC20.bytecode;
    let args = ['0x' + new BigNumber(this.totalSupply).shiftedBy(Number(this.decimals)).toString(16), this.name, this.symbol, this.decimals];

    return this.web3Serv.formCreateSmartContractABI(abi, fabBytecode.trim(), args);

  }

  deployFabSmartContract() {
    let abiHex = this.formCreateSmartContractABI();
    let gasLimit = 4000000;
    const gasPrice = 40;


    let value = 0;

    const totalAmount = gasLimit * gasPrice / 1e8;
    // let cFee = 3000 / 1e8 // fee for the transaction

    let totalFee = totalAmount;

    //console.log('number==', (smartContractAddress == '0x0') ? 193 : 194);

    console.log('gasLimit=', gasLimit);
    let contract = Btc.script.compile([
      84,
      this.utilServ.number2Buffer(gasLimit),
      this.utilServ.number2Buffer(gasPrice),
      this.utilServ.hex2Buffer(this.utilServ.stripHexPrefix(abiHex)),
      193
    ]);


    const contractSize = contract.toJSON.toString().length;
    totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

    console.log('totalFee==', totalFee);
    return { contract, totalFee };
  }


  onTotalSupplyChange(event) {
    this.totalSupply = event;
  }

  onDecimalsChange(event) {
    this.decimals = event;
  }
}
