import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { TimerService } from 'src/app/services/timer.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import * as exaddr from '../../lib/exaddr';
import { PinNumberModal } from '../shared/modals/pin-number/pin-number.modal';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'app-bindpay',
    templateUrl: './bindpay.component.html',
    styleUrls: ['./bindpay.component.scss'],
    providers: []
  })

export class BindpayComponent  implements OnInit{
  address: string;
  exAddress: string;
  pin: string;
  receiverAddress: string;
  transactionHistory: any;
  tokenIndex: number;
  token: any;
  amount: number;
  mytokens: any;
  transactionHistories: any;
  wallet: any;
  gas: number = 0;
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

  constructor(
      public coinServ: CoinService,
      public utilServ: UtilService,
      private web3Serv: Web3Service,

      private timerServ: TimerService,
      private translateServ: TranslateService,
      private alertServ: AlertService,
      private kanbanServ: KanbanService,
      private walletServ: WalletService) {}

  async ngOnInit() {
    this.wallet = await this.walletServ.getCurrentWallet();
    if (this.wallet) {
        this.address = this.wallet.excoin.receiveAdds[0].address;
        const fabAddress = this.utilServ.exgToFabAddress(this.address);
        this.exAddress = exaddr.toKbpayAddress(fabAddress);


        this.kanbanServ.getBalance(this.wallet.excoin.receiveAdds[0].address).subscribe(
            {
                next: (resp: any) => {
                console.log('resp for gasfffff=', resp);
                if(resp.success) {
                    const data = resp.data;
                    this.gas = new BigNumber(data.native).shiftedBy(-18).toNumber();
                    this.mytokens = data.tokens;
                }


            },
            error:(error) => {
                // console.log('errorrrr=', error);
            }
        });

        /*
        this.timerServ.tokens.subscribe(
            (tokens: any) => {
               if(!this.token) {
                   return;
               }
               const coinType = this.token.coinType;
               const newCoins = tokens.filter(item => item.coinType == coinType);
               console.log('coinType==', coinType);
               console.log('newCOins=', newCoins);
                if(newCoins && newCoins.length > 0) {
                    const newCoin = newCoins[0];
                    console.log('newCoin=', newCoin);
                    if(newCoin.unlockedAmount != this.token.unlockedAmount) {
                        this.token.unlockedAmount = newCoin.unlockedAmount;
                    }
                }
            }
        );
        */
    }   
  }

  confirmTransfer() {
    this.transactionHistory = false;

    console.log('tokenIndex=', this.tokenIndex);
    const tokenIndex = this.tokenIndex;
   if(tokenIndex >= 0) {
        if (this.amount > this.utilServ.toNumber(this.utilServ.showAmount(this.mytokens.balances[tokenIndex], this.mytokens.decimals[tokenIndex]))) {
            this.alertServ.openSnackBar(this.translateServ.instant('Not enough balance'), this.translateServ.instant('Ok'));
            return;
        }
   }


    this.pinModal.show();
  }

  onConfirmedPin(pin: string) {
    this.pin = pin;
    const pinHash = this.utilServ.SHA256(pin).toString();
    if (pinHash !== this.wallet.pwdHash) {

        this.alertServ.openSnackBar(this.translateServ.instant('Your password is invalid.'), this.translateServ.instant('Ok'));
        return;
    }
    this.transferDo();

  }

  async transferDo() {
    //console.log('transferDo start');
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
    const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
    let toAddressLegacy = '';
    try {
        toAddressLegacy = exaddr.toLegacyAddress(this.receiverAddress);
        //console.log('toAddressLegacy===', toAddressLegacy);
    } catch(e) {

    }
    
    if(!toAddressLegacy) {
        this.alertServ.openSnackBar(
            this.translateServ.instant('The format of the payment address is incorrect.'), this.translateServ.instant('Ok'));


        return;            
    }

    const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

    let txhex;
    const toAddressHex = this.utilServ.fabToExgAddress(toAddressLegacy);
    if(this.tokenIndex >= 0) {
        let abiHex = this.web3Serv.getTransferFuncABI(toAddressHex, this.amount, this.mytokens.decimals[this.tokenIndex]);
        txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, this.mytokens.ids[this.tokenIndex], nonce, 0);
    } else {
        txhex = await this.web3Serv.signAbiHexWithPrivateKey('0x', keyPairsKanban, toAddressHex, nonce, '0x' + new BigNumber(this.amount).shiftedBy(18).toString(16));
    }

    

    
    
    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
        console.log('resp=', resp);
        if (resp && resp.transactionHash) {

            this.timerServ.checkTokens(keyPairsKanban.address, 10);

            // this.tradeService.saveTransactions(this.openorders);
            // this.kanbanServ.incNonce();

                this.alertServ.openSnackBar(this.translateServ.instant('Transfer request is pending.'), this.translateServ.instant('Ok'));

        }
    },
        (error) => {
            if (error.error) {
                this.alertServ.openSnackBar(error.error, 'Ok');
            }

        });
  }

  showTransactionHisotry() {
    this.transactionHistory = true;
    const address = this.wallet.excoin.receiveAdds[0].address;
    const fabAddress = this.utilServ.exgToFabAddress(address);
    this.kanbanServ.getTransactionHistory(fabAddress).subscribe(
        (res: any) => {
            if(res && res.success) {
                this.transactionHistories = res.data;
            }
        }
    );
  }


}
