import { Component, Output, TemplateRef, Input, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { WalletService } from '../../../../services/wallet.service';
import * as randomBytes from 'randombytes';
import { Web3Service } from '../../../../services/web3.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { KanbanService } from '../../../../services/kanban.service';
import { version } from '../../../../../environments/version';
@Component({
    selector: 'app-trade-auto',
    templateUrl: './trade-auto.component.html',
    styleUrls: ['./trade-auto.component.css']
})

export class TradeAutoComponent implements OnInit {
    nonces: any = [];
    version: string;
    constructor(private walletServ: WalletService, private web3Serv: Web3Service, private utilService: UtilService,
        private coinService: CoinService, private kanbanService: KanbanService) {

    }
    
    ngOnInit() {
        this.version = version;
    }

    async getNonce(address: string) {
        let value = 0;
        for (let i = 0; i < this.nonces.length; i++) {
            const nonce = this.nonces[i];
            if (nonce.address === address) {
                nonce.value++;
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

    generateOrderHash(bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration) {
        const randomString = randomBytes(32).map(String).join('');
        const concatString = [bidOrAsk, orderType, baseCoin, targetCoin, amount, price, timeBeforeExpiration, randomString].join('');
        return this.web3Serv.sha3(concatString);
    }

    async txHexforPlaceOrder
        (pin: string, wallet: any, bidOrAsk: boolean, baseCoin: number, targetCoin: number, price: number, qty: number) {
        const seed = this.utilService.aesDecryptSeed(wallet.encryptedSeed, pin);
        if(!seed) {
            return;
        }
        const keyPairsKanban = this.coinService.getKeyPairs(wallet.excoin, seed, 0, 0);
        const orderType = 1;
        if (!bidOrAsk) {
            const tmp = baseCoin;
            baseCoin = targetCoin;
            targetCoin = tmp;
        }
        const timeBeforeExpiration = 423434342432;

        const address = await this.kanbanService.getExchangeAddress();

        const nonce = await this.getNonce(keyPairsKanban.address);
        console.log('keyPairsKanban.address=' + keyPairsKanban.address + ',nonce=' + nonce);
        // nonce = 84;     
        const orderHash = this.generateOrderHash(bidOrAsk, orderType, baseCoin, targetCoin, qty, price, timeBeforeExpiration);

        const abiHex = this.web3Serv.getCreateOrderFuncABI([bidOrAsk,
            orderType, baseCoin, targetCoin, (Math.floor(qty * 1e18)).toString(), (Math.floor(price * 1e18)).toString(),
            timeBeforeExpiration, false, orderHash]);
        
        console.log('abiHex=', abiHex);
        /*
        if (this.oldNonce === nonce) {
            this.alertServ.openSnackBar('Please wait a sec, no rush.', 'ok');
            return;
        }
        */
        const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce);
        return {
            txHex: txHex,
            orderHash: orderHash
        };
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async placeOrders() {
        const wallets = await this.walletServ.getWallets();
        const pin = '1qaz@WSX';

        let price = 190;
        for (let i = 0; i < 500; i++) {
            console.log('i=', i);
            let bidOrAsk = false;
            const walletIndex = 10;
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


            const baseCoin = 1;
            const targetCoin = 3;

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
            const qty: any = 0.00001 * Math.random() * 10;
            const resTeHex: any = await this.txHexforPlaceOrder(pin, wallet, bidOrAsk, baseCoin, targetCoin, price, qty);

            const txHex: any = resTeHex?.txHex;
            this.kanbanService.sendRawSignedTransaction(txHex).subscribe((resp: any) => {
                if (resp && resp.transactionHash) {
                    console.log('transactionHash=', resp.transactionHash);
                }
            });
            // await this.delay(1000);
        }

    }
}
