import { Component, ViewEncapsulation, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
import { WalletService } from '../../../../services/wallet.service';
import { CoinService } from '../../../../services/coin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilService } from '../../../../services/util.service';
import { ApiService } from '../../../../services/api.service';
import {KanbanService} from '../../../../services/kanban.service';
import {Web3Service} from '../../../../services/web3.service';
import {Signature, Token} from '../../../../interfaces/kanban.interface';
import { DepositAmountModal } from '../../modals/deposit-amount/deposit-amount.modal';
import { AddAssetsModal } from '../../modals/add-assets/add-assets.modal';
import { PinNumberModal } from '../../modals/pin-number/pin-number.modal';
import { AddGasModal } from '../../modals/add-gas/add-gas.modal';
import { ShowSeedPhraseModal } from '../../modals/show-seed-phrase/show-seed-phrase.modal';
import { VerifySeedPhraseModal } from '../../modals/verify-seed-phrase/verify-seed-phrase.modal';
import { SendCoinModal } from '../../modals/send-coin/send-coin.modal';
import { BackupPrivateKeyModal } from '../../modals/backup-private-key/backup-private-key.modal';
import {CoinsPrice} from '../../../../interfaces/balance.interface';
import {SendCoinForm} from '../../../../interfaces/kanban.interface';
import {StorageService} from '../../../../services/storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularCsv } from 'angular7-csv';

@Component({
    selector: 'app-wallet-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletDashboardComponent {
    @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
    @ViewChild('depositModal', {static: true}) depositModal: DepositAmountModal;
    @ViewChild('addGasModal', {static: true}) addGasModal: AddGasModal;
    @ViewChild('addAssetsModal', {static: true}) addAssetsModal: AddAssetsModal;
    @ViewChild('sendCoinModal', {static: true}) sendCoinModal: SendCoinModal;
    @ViewChild('showSeedPhraseModal', {static: true}) showSeedPhraseModal: ShowSeedPhraseModal;
    @ViewChild('verifySeedPhraseModal', {static: true}) verifySeedPhraseModal: VerifySeedPhraseModal;
    @ViewChild('backupPrivateKeyModal', {static: true}) backupPrivateKeyModal: BackupPrivateKeyModal;

    sendCoinForm: SendCoinForm;
    wallet: Wallet; 
    wallets: Wallet[];
    modalRef: BsModalRef;
    checked = true;
    exgAddress: string;
    currentWalletIndex: number;
    currentCoin: MyCoin;
    amount: number;
    coinsPrice: CoinsPrice;
    pin: string;
    seed: Buffer;
    showMyAssets: boolean;
    showTransactionHistory: boolean;
    gas: number;
    opType: string;

    constructor ( private route: Router, private walletServ: WalletService, private modalServ: BsModalService, 
        private coinServ: CoinService, private utilServ: UtilService, private apiServ: ApiService, 
        private kanbanServ: KanbanService, private web3Serv: Web3Service, private viewContainerRef: ViewContainerRef,
        private utilService: UtilService, private _snackBar: MatSnackBar,
        private coinService: CoinService, private storageService: StorageService) {
        this.showMyAssets = true;
        this.showTransactionHistory = false;
        this.loadWallet();
        this.loadBalance();
    }

    onConfirmedBackupPrivateKey(cmd: string) {
        console.log('onConfirmedBackupPrivateKey start, cmd=', cmd);

        const options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: false, 
            showTitle: false,
            title: 'Your title',
            useBom: true,
            noDownload: false,
            headers: ['Coin', 'Chain', 'Index', 'Address', 'Private Key']
        };        
        const data = [];
        
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const coin = this.wallet.mycoins[i];
            for (let j = 0; j < coin.receiveAdds.length; j++) {
                const addr = coin.receiveAdds[j];
                const keyPair = this.coinServ.getKeyPairs(coin, this.seed, 0, addr.index);
                const item = {
                    coin: coin.name,
                    chain: 'external',
                    index: addr.index,
                    address: addr.address,
                    privateKey: keyPair.privateKeyDisplay
                };
                data.push(item);
            }

            for (let j = 0; j < coin.changeAdds.length; j++) {
                const addr = coin.changeAdds[j];
                const keyPair = this.coinServ.getKeyPairs(coin, this.seed, 1, addr.index);
                const item = {
                    coin: coin.name,
                    chain: 'change',
                    index: addr.index,
                    address: addr.address,
                    privateKey: keyPair.privateKeyDisplay
                };
                data.push(item);
            }            
        }
        const csv = new AngularCsv(data, 'Private Keys for wallet ' + this.wallet.name, options);
    }

    onShowMyAssets() {
        this.showMyAssets = true;
        this.showTransactionHistory = false;
    }

    onmanageWallet(type: string) {
        console.log('type in dashboard=' + type);
        if (type === 'SHOW_SEED_PHRASE') {
            this.opType = 'showSeedPhrase';
            this.pinModal.show();            
        } else 
        if (type === 'VERIFY_SEED_PHRASE') {
            this.opType = 'verifySeedPhrase';
            this.pinModal.show();            
        } else 
        if (type === 'BACKUP_PRIVATE_KEY') {
            this.opType = 'backupPrivateKey';
            this.pinModal.show();  
        }        
    }

    onShowTransactionHistory() {
        this.showMyAssets = false;
        this.showTransactionHistory = true;
    }

    async loadBalance() {
        this.coinsPrice = await this.apiServ.getCoinsPrice();
        console.log('this.coinsPrice=');
        console.log(this.coinsPrice);
        if (!this.wallet) {
            return;
        }
        
        let updated = false;
        for ( let i = 0; i < this.wallet.mycoins.length; i++ ) {
            const coin = this.wallet.mycoins[i];
            const balance = await this.coinServ.getBalance(coin);
            if (coin.balance !== balance) {
                coin.balance = balance;
                updated = true;
            }
        }
        if (updated) {
            this.walletServ.updateToWalletList(this.wallet, this.currentWalletIndex);
        }
    }
    startTimer() {
        setInterval(() => {
            this.loadBalance();

        },5000)
    }

    changeWallet(value) {
        this.currentWalletIndex = value;
        //this.wallet = this.wallets[this.currentWalletIndex];
        //this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.walletServ.saveCurrentWalletIndex(value);
        this.loadWallet();
    }

    loadWallet() {
        this.walletServ.getWalletList().subscribe((wallets: Wallet[]) => {

            if (wallets) {
                this.wallets = wallets;
                this.currentWalletIndex = wallets.length - 1;
                this.walletServ.getCurrentWalletIndex().subscribe(
                async (index: number) => {
                 if (index !== null) {
                    this.currentWalletIndex = index;
                 }
                   
                this.wallet = wallets[this.currentWalletIndex];

                this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
                console.log('load wallet again.');
                this.gas = await this.kanbanServ.getGas(this.wallet.excoin.receiveAdds[0].address);
                        /*
                        this.wallets = new Array<Wallet>();
                        wallets.forEach(wl => { this.wallets.push(wl); });
                        */
                    }
                );

            } else {
                this.route.navigate(['/wallet/no-wallet']);
            }
        });
    }
    exchangeMoney() {
        this.route.navigate(['/market/home']);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalServ.show(template);
    } 

    
    addGasFee() {
        //this.currentCoin = this.wallet.mycoins[1];
        this.addGasModal.show();
    }
    
    async withdraw(currentCoin: MyCoin) {
        const pin = '1qaz@WSX';
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);   

        const abiHex = '379eb8621c000000000000000000000000000000000000000000000000000000000000024df1b18ddc1079c446e23ee6d5008e40f19033c6eb28e44a479e05273553d9810000000000000000000000000000000000000000000000000031bced02db0000000000000000000000000000463fb771ce5c8b5914a790f170074e6a1306204f0ef43686352a67ec8e0d812f8b6e34f952b931911851e23761979d01536ab253020efb2b83e4acabed5869d552b4e9463c6bbc3ae42a3491901bf9b8df14845c';
        const address = '0xf16a0291680456538c31ab5fb2db383d9b662eaa';
        const nonce = 0;
        const hash1 = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, false);
        console.log('hash1=', hash1);
        const hash2 = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, true);
        
        console.log('hash2=', hash2);
    }

    deposit(currentCoin: MyCoin) {
        this.currentCoin = currentCoin;
        this.depositModal.show();
        /*
        this.amount = 0.2;
        this.pin = '1qaz@WSX';
        this.depositdo();
        */
    }

    onConfirmedAmount(amount: number) {
        this.amount = amount;
        this.opType = 'deposit';
        this.pinModal.show();
    }

    onConfirmedGas(amount: number) {
        this.amount = amount;
        this.opType = 'addGas';
        this.pinModal.show();        
    }

    onConfirmedCoinSent(sendCoinForm: SendCoinForm) {
        this.sendCoinForm = sendCoinForm;
        this.opType = 'sendCoin';
        this.pinModal.show();
    }

    addAssets() {
        this.addAssetsModal.show();
    }

    sendCoin() {
        this.sendCoinModal.show();
    }

    onConfirmedPin(pin: string) {
        console.log('pin is:' + pin);
        this.pin = pin;
        if (this.opType === 'deposit') {
            this.depositdo();
        } else 
        if (this.opType === 'addGas') {
            this.addGasDo();
        } else
        if (this.opType === 'sendCoin') {
            this.sendCoinDo();
        } else 
        if (this.opType === 'showSeedPhrase') {
            this.showSeedPhrase();
        } else
        if (this.opType === 'verifySeedPhrase') {
            this.verifySeedPhrase();
        } else 
        if (this.opType === 'backupPrivateKey') {
            this.backupPrivateKey();
        }
    }

    showSeedPhrase() {
        let seedPhrase = '';
        if (this.wallet.encryptedMnemonic) {
            seedPhrase = this.utilServ.aesDecrypt(this.wallet.encryptedMnemonic, this.pin);
        }
        if (seedPhrase) {
            this.showSeedPhraseModal.show(seedPhrase);
        } else {
            this._snackBar.open('Your pin number is invalid.', 'Ok', {
                duration: 2000,
            });
        }
    }

    backupPrivateKey() {
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        this.seed = seed;
        if (!seed) {
            this._snackBar.open('Your pin number is invalid.', 'Ok', {
                duration: 2000,
            });        
            return;   
        } 
        this.backupPrivateKeyModal.show(seed, this.wallet);
    }

    verifySeedPhrase() {
        let seedPhrase = '';
        if (this.wallet.encryptedMnemonic) {
            seedPhrase = this.utilServ.aesDecrypt(this.wallet.encryptedMnemonic, this.pin);
        }

        if (seedPhrase) {
            this.verifySeedPhraseModal.show(seedPhrase);
        } else {
            this._snackBar.open('Your pin number is invalid.', 'Ok', {
                duration: 2000,
            });
        }        
        
    }

    onConfirmedAssets(assets: [Token]) {
        for (let i = 0; i < assets.length; i++) {
            const token = assets[i];
            const type = token.type;
            const name = token.name;
            const addr = token.address;
            const decimals = token.decimals;
            for (let j = 0; j < 5 ; j ++) {
                if (this.wallet.mycoins[j].name === type) {
                    const baseCoin = this.wallet.mycoins[j];
                    const mytoken = this.coinServ.initToken(type, name, decimals, addr, baseCoin);
                    this.wallet.mycoins.push(mytoken);
                    break;
                }
            }

        }
    }

    async depositFab(currentCoin) {
        const amount = this.amount;
        const pin = this.pin;     
        
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this._snackBar.open('Your pin number is invalid.', 'Ok', {
                duration: 2000,
            });        
            return;   
        } 
        const scarAddress = await this.kanbanServ.getScarAddress();
        //const scarAddress = '98cda3da6813b4711d7f0c1637480b2353b00c1c';
        console.log('scarAddress=', scarAddress);
        this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);

    }

    async addGasDo() {
        const currentCoin = this.wallet.mycoins[1];
        this.depositFab(currentCoin);        
    }
    async sendCoinDo() {
        const pin = this.pin;
        const currentCoin = this.wallet.mycoins[this.sendCoinForm.coinIndex];

        const seed = this.utilService.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this._snackBar.open('Your pin number is invalid.', 'Ok', {
                duration: 2000,
            });        
            return;   
        } 
        const amount = this.sendCoinForm.amount;
        const doSubmit = true;
        const {txHex, txHash} = await this.coinService.sendTransaction(currentCoin, seed, 
            this.sendCoinForm.to, amount, doSubmit
        );
        if (txHex) {
            const today = new Date();
            const item = {
                type: 'Send',
                coin: currentCoin.name,
                amount: amount,
                txid: txHash,
                time: today, 
                comment: ''
            };
            this.storageService.storeToTransactionHistoryList(item);
        }
    }

    async depositdo() {

        let currentCoin = this.currentCoin;

        /*
        if (currentCoin == null) {
            currentCoin = this.wallet.mycoins[1];
            this.depositFab(currentCoin);
            return;
        }       
        */
        const amount = this.amount;
        const pin = this.pin;

        const coinType = this.coinServ.getCoinTypeIdByName(currentCoin.name);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this._snackBar.open('Your pin number is invalid.', 'Ok', {
                duration: 2000,
            });        
            return;   
        }         
        const keyPairs = this.coinServ.getKeyPairs(currentCoin, seed, 0, 0);


        const officalAddress = this.coinServ.getOfficialAddress(currentCoin);
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;

        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const doSubmit = false;
        const {txHex, txHash} = await this.coinServ.sendTransaction(currentCoin, seed, officalAddress, amount, doSubmit);   

        console.log('111111111111111111111111111111111111111111111111111111111111');
        console.log('txHex=' + txHex);
        console.log('txHash=' + txHash);
        // const txHash = '7f72c0043edce99f3e8c09c14c8919bec81e5fb2938f746d704406ba8e9182da';
        if (!txHash) {
            this._snackBar.open('Not enough fund.', 'Ok', {
                duration: 2000,
            });              
            return;
        }


        const amountInLink = amount * 1e18; // it's for all coins.
        const originalMessage = this.coinServ.getOriginalMessage(coinType, txHash.substring(2), amountInLink, addressInKanban.substring(2));
        //console.log('a');
        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);
        //console.log('b');
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        //console.log('c');
        const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);
        //console.log('d');
        let nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
        //const nonce = 0;
        const includeCoin = true;
        //console.log('e');
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 
        //console.log('f');
        
        /*
        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp) => { 
            console.log('resp=' + resp);
        });         
        */
       
       
       this.kanbanServ.submitDeposit(txHex, txKanbanHex).subscribe((resp) => { 
            console.log('resp=' + resp);
        }); 
         
    }
}
