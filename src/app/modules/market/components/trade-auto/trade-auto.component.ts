import { Component, Output, TemplateRef, Input, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { WalletService } from '../../../../services/wallet.service';
import * as secureRandom from 'secure-random';
import { Web3Service } from '../../../../services/web3.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { KanbanService } from '../../../../services/kanban.service';
import {TransactionResp} from '../../../../interfaces/kanban.interface';
import { price_list, coin_list } from '../../../../config/coins';
import * as bip39 from 'bip39';
import * as BIP32 from 'node_modules/bip32';
import { environment } from '../../../../../environments/environment';
@Component({
    selector: 'app-trade-auto',
    templateUrl: './trade-auto.component.html',
    styleUrls: ['./trade-auto.component.css']
})


export class TradeAutoComponent implements OnInit {
    nonces = [];
    version: number;
    constructor(private walletServ: WalletService, private web3Serv: Web3Service, private utilService: UtilService,
        private coinService: CoinService, private kanbanService: KanbanService) {

    }
    ngOnInit() { 
        this.version = environment.version;
    }

    async getNonce(address: string) {
        let value = 0;
        for (let i = 0; i < this.nonces.length; i++) {
            const nonce = this.nonces[i];
            if (nonce.address === address) {
                nonce.value ++;
                return nonce.value;
            }
        } 
        value = await this.kanbanService.getTransactionCount(address);
        const item = {
            address: address,
            value: value
        };
        this.nonces.push(item);
        return value;
    }

    generateOrderHash (bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration) {
        const randomString = secureRandom.randomUint8Array(32).map(String).join('');
        const concatString = [bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration, randomString].join('');
        return this.web3Serv.sha3(concatString);
    }

    async txHexforPlaceOrder
    (pin: string, wallet: any, bidOrAsk: boolean, baseCoin: number, targetCoin: number, price: number, qty: number) {
      const seed = this.utilService.aesDecryptSeed(wallet.encryptedSeed, pin);
      const keyPairsKanban = this.coinService.getKeyPairs(wallet.excoin, seed, 0, 0);
      const orderType = 1;
      if (!bidOrAsk) {
        const tmp = baseCoin;
        baseCoin = targetCoin;
        targetCoin = tmp;
      }
      const timeBeforeExpiration = 423434342432;

      const address = await this.kanbanService.getExchangeAddress();

      let nonce = await this.getNonce(keyPairsKanban.address);
      console.log('keyPairsKanban.address=' + keyPairsKanban.address + ',nonce=' + nonce);
      // nonce = 84;     
      const orderHash = this.generateOrderHash(bidOrAsk, orderType, baseCoin
          , targetCoin, qty, price, timeBeforeExpiration);

      const abiHex = this.web3Serv.getCreateOrderFuncABI([bidOrAsk,  
          orderType, baseCoin, targetCoin, (Math.floor(qty * 1e18)).toString(), (Math.floor(price * 1e18)).toString(), 
          timeBeforeExpiration, false, orderHash]);

      /*
      if (this.oldNonce === nonce) {
          this.alertServ.openSnackBar('Please wait a sec, no rush.', 'ok');
          return;
      }
      */
      const includeCoin = true;
      const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, includeCoin); 
      return {
        txHex: txHex,
        orderHash: orderHash
      };
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    testme() {
        const randomMnemonic = 'culture sound obey clean pretty medal churn behind chief cactus alley ready';
        const seed = bip39.mnemonicToSeedSync(randomMnemonic);

        const root = BIP32.fromSeed(seed);
        const bitCoinChild1 = root.derive(0x80000000 + 44);
        /*
        const bitCoinChild2 = bitCoinChild1.deriveHardened(1);
        const bitCoinChild3 = bitCoinChild2.deriveHardened(0);
        const bitCoinChild4 = bitCoinChild3.derive(0);
        const bitCoinChild = bitCoinChild4.derive(0);      
        */
        console.log('root.base58()' + root.toBase58());
        console.log('bitCoinChild1.publicKey');
        console.log(bitCoinChild1.publicKey);
        /*
        console.log('bitCoinChild2.base58()=');
        console.log(bitCoinChild2.toBase58());
        console.log('bitCoinChild3.base58()=');
        console.log(bitCoinChild3.toBase58());
        console.log('bitCoinChild4.base58()');
        console.log(bitCoinChild4.toBase58());
        console.log('bitCoinChild.base58()');
        console.log(bitCoinChild.toBase58());
        */
    }
    async placeOrders() {
        const wallets = await this.walletServ.getWallets();
        const pin = '1qaz@WSX';
        
        let price = 190;
        for (let i = 0; i < 500; i++) {
            console.log('i=', i);
            let bidOrAsk = false;
            let walletIndex = 10;
            price = 190 + Math.random() * 100;
            if (i % 2 === 0) {
                bidOrAsk = true;
                // walletIndex = 11;
                
            }
            const wallet = wallets[walletIndex];
            console.log('wallet.name=', wallet.name);
            const index = (Math.floor(i / 2)) % 10;
            console.log('index=' + index);
            // const baseCoin = price_list[index].base_id;
            // const targetCoin = price_list[index].coin_id;

            
            let baseCoin = 1;
            let targetCoin = 3;  
            
            /*
            if (i % 6 === 2 || i % 6 === 3) {
                baseCoin = 2;
                targetCoin = 3;
            }    
            if (i % 6 === 4 || i % 6 === 5) {
                baseCoin = 1;
                targetCoin = 2;
            }  
            */              
            console.log('baseCoin = ' + baseCoin + ',targetCoin = ' + targetCoin);
            // const qty = 0.00001 * Math.random() * 10;
            const qty = 0.00001 * Math.random() * 10;
            const {txHex, orderHash} = await this.txHexforPlaceOrder(
                pin, wallet, bidOrAsk, baseCoin, targetCoin, price, qty
            );
      
            this.kanbanService.sendRawSignedTransaction(txHex).subscribe((resp: TransactionResp) => {
                if (resp && resp.transactionHash) {
                    console.log('transactionHash=', resp.transactionHash);
                }
            });
            //await this.delay(1000);
        }

    }
}
