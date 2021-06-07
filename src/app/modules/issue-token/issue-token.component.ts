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

@Component({
  selector: 'app-issue-token',
  templateUrl: './issue-token.component.html',
  styleUrls: ['./issue-token.component.scss'],
  providers: [CoinService]
})

export class IssueTokenComponent implements OnInit {
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

  totalSupply: number;
  name: string;
  symbol: string;
  decimals: number;
  wallet: any;
  totalFee: number = 1000;
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
      this.alertServ.openSnackBar('no current wallet was found.', 'Ok');
      return;
    }

    for (let i = 0; i < this.wallet.mycoins.length; i++) {
      const coin: MyCoin = this.wallet.mycoins[i];
      if ((coin.name === 'FAB') && !coin.tokenType) {
        this.mycoin = coin;
        //const { balance, lockbalance } = await this.coinServ.getBalance(coin);
        this.balance = coin.balance;
        this.address = this.mycoin.receiveAdds[0].address;
        break;
      }
    }
    this.txs = [];
    this.storageService.getIssueTokenTransactions().subscribe(
      async (res: IssueToken[]) => {

        if (res) {
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
        }
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
    const keyPair = this.coinServ.getKeyPairs(this.mycoin, seed, 0, 0);
    console.log('keyPair====', keyPair);
    const { txHex, errMsg, transFee } = await this.coinServ.getFabTransactionHexMultiTos(keyPair.privateKey, this.address, tos, totalFee,
      satoshisPerBytes, bytesPerInput);

    console.log('transFee==', transFee);
    if (txHex) {
      const res2 = await this.apiServ.postFabTx(txHex);
      this.txHash = res2.txHash;
      this.errMsg = res2.errMsg;
      const tx: IssueToken = {
        txid: this.txHash,
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
    } else
      if (errMsg) {
        this.alertServ.openSnackBar(errMsg, this.translateServ.instant('Ok'));
        //this.errMsg = errMsg;
      }
  }

  formCreateSmartContractABI() {
    let abi = FRC20.ABI;
    const fabBytecode = FRC20.bytecode;
    let args = [this.totalSupply, this.name, this.symbol, this.decimals];

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

}
