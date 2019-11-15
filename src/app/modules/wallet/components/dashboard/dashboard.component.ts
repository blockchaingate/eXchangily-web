import { Component, ViewEncapsulation, TemplateRef, ViewChild, ViewContainerRef, OnInit  } from '@angular/core';
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
import { WithdrawAmountModal } from '../../modals/withdraw-amount/withdraw-amount.modal';
import { AddAssetsModal } from '../../modals/add-assets/add-assets.modal';
import { PinNumberModal } from '../../modals/pin-number/pin-number.modal';
import { AddGasModal } from '../../modals/add-gas/add-gas.modal';
import { ShowSeedPhraseModal } from '../../modals/show-seed-phrase/show-seed-phrase.modal';
import { VerifySeedPhraseModal } from '../../modals/verify-seed-phrase/verify-seed-phrase.modal';
import { SendCoinModal } from '../../modals/send-coin/send-coin.modal';
import { BackupPrivateKeyModal } from '../../modals/backup-private-key/backup-private-key.modal';
import { DeleteWalletModal } from '../../modals/delete-wallet/delete-wallet.modal';
import { LoginSettingModal } from '../../modals/login-setting/login-setting.modal';
import {CoinsPrice} from '../../../../interfaces/balance.interface';
import {SendCoinForm} from '../../../../interfaces/kanban.interface';
import {StorageService} from '../../../../services/storage.service';
import {AlertService} from '../../../../services/alert.service';
import { AngularCsv } from 'angular7-csv';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionItem } from '../../../../models/transaction-item';

import * as bs58 from 'bs58';
@Component({ 
    selector: 'app-wallet-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletDashboardComponent {
    @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
    @ViewChild('depositModal', {static: true}) depositModal: DepositAmountModal;
    @ViewChild('withdrawModal', {static: true}) withdrawModal: WithdrawAmountModal;
    @ViewChild('addGasModal', {static: true}) addGasModal: AddGasModal;
    @ViewChild('addAssetsModal', {static: true}) addAssetsModal: AddAssetsModal;
    @ViewChild('sendCoinModal', {static: true}) sendCoinModal: SendCoinModal;
    @ViewChild('showSeedPhraseModal', {static: true}) showSeedPhraseModal: ShowSeedPhraseModal;
    @ViewChild('verifySeedPhraseModal', {static: true}) verifySeedPhraseModal: VerifySeedPhraseModal;
    @ViewChild('backupPrivateKeyModal', {static: true}) backupPrivateKeyModal: BackupPrivateKeyModal;
    @ViewChild('deleteWalletModal', {static: true}) deleteWalletModal: DeleteWalletModal;
    @ViewChild('loginSettingModal', {static: true}) loginSettingModal: LoginSettingModal;
    
    sendCoinForm: SendCoinForm;
    wallet: Wallet; 
    wallets: Wallet[];
    modalRef: BsModalRef;
    checked = true;
    exgAddress: string;
    exgBalance: number;
    currentWalletIndex: number;
    currentCoin: MyCoin;
    amount: number;
    coinsPrice: CoinsPrice;
    pin: string;
    seed: Buffer;
    hideSmall: boolean;
    showMyAssets: boolean;
    showTransactionHistory: boolean;
    gas: number;
    opType: string;
    currentCurrency: string;
    currencyRate: number;
    constructor ( private route: Router, private walletServ: WalletService, private modalServ: BsModalService, 
        private coinServ: CoinService, public utilServ: UtilService, private apiServ: ApiService, 
        private kanbanServ: KanbanService, private web3Serv: Web3Service, private viewContainerRef: ViewContainerRef,
        private alertServ: AlertService, private matIconRegistry: MatIconRegistry,
        private coinService: CoinService, private storageService: StorageService, private domSanitizer: DomSanitizer) {
        this.showMyAssets = true;
        this.currentCurrency = 'USD';
        this.currencyRate = 1;
        this.showTransactionHistory = false;
        this.matIconRegistry.addSvgIcon(
            'icon_copy',
            this.domSanitizer.bypassSecurityTrustResourceUrl('/images/copy.svg')
          );
    }

    changeCurrency(name: string) {
        this.currentCurrency = name;
        if (name === 'USD') {
            this.currencyRate = 1;
        } else 
        if (name === 'CAD') {
            this.currencyRate = 1.31;
        } else 
        if (name === 'RMB') {
            this.currencyRate = 7.07;
        }
    }
    async updateCoinBalance(coinName: string) {
        console.log('coinName=' + coinName);
        let interval = 3000;
        if (coinName === 'FAB') {
            interval = 8000;
        }
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const coin = this.wallet.mycoins[i];
            console.log('coin.name=' + coin.name);
            if (coin.name === coinName) {
                for (let j = 0; j < 20; j++) {
                    await new Promise(resolve => setTimeout(resolve, interval));
                    const balance = await this.coinServ.getBalance(coin);
                    if (coin.balance !== balance.balance || coin.lockedBalance !== balance.lockbalance) {                        
                        console.log('you got it');
                        coin.balance = balance.balance;
                        coin.lockedBalance = balance.lockbalance;
                        break;
                    }
                }

            }
        }
    }
    async ngOnInit() {
        await this.loadWallets();
        // this.currentWalletIndex = await this.walletServ.getCurrentWalletIndex();
        console.log('this.currentWalletIndex=', this.currentWalletIndex);
        if (!this.currentWalletIndex) {
            this.currentWalletIndex = 0;
        }
        if (this.wallets) {
            await this.loadWallet(this.wallets[this.currentWalletIndex]);
            this.loadCoinsPrice();
    
            // this.startTimer();
            this.loadBalance();   
        }
     
        if (this.exgAddress) {
            this.kanbanServ.getDepositErr(this.exgAddress).subscribe(
                (resp: any) => {
                    console.log('resp=', resp);
                    
                    for (let i = 0; i < resp.length; i++) {
                        const coinType = resp[i].coinType;
                        for (let j = 0; j < this.wallet.mycoins.length; j++) {
                            const name = this.wallet.mycoins[j].name;
                            const myCoinType = this.coinServ.getCoinTypeIdByName(name);
                            console.log('coinType=' + coinType + ',myCoinType=' + myCoinType);
                            if (coinType === myCoinType) {
                                console.log('got it');
                                if (!this.wallet.mycoins[j].redeposit) {
                                    this.wallet.mycoins[j].redeposit = [];
                                }
                                this.wallet.mycoins[j].redeposit.push(resp[i]);
                            }
                        }
                    }
                    console.log('this.wallet.mycoins===', this.wallet.mycoins);
                }
            );
        }
        this.storageService.changedTransaction.subscribe(
            (transaction: TransactionItem) => {
                
                const status = transaction.status;
                const type = transaction.type;
                const amount = transaction.amount;
                const coin = transaction.coin;
                if (status === 'confirmed') {
                    if (type === 'Add Gas') {
                        this.gas += amount;
                        this.updateCoinBalance('FAB');
                    } else
                    if (type === 'Send') {
                        this.updateCoinBalance(coin);
                    }
                }

            }
        );        
    }

    copyAddress() {
        this.utilServ.copy(this.exgAddress);
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
        } else 
        if (type === 'DELETE_WALLET') {
            this.opType = 'deleteWallet';
            this.pinModal.show();  
        } else
        if (type === 'LOGIN_SETTING') {
            this.opType = 'loginSetting';
            this.pinModal.show();
        }        
    }

    onShowTransactionHistory() {
        this.showMyAssets = false;
        this.showTransactionHistory = true;
    }

    async onConfirmedDeleteWallet() {
        console.log('confirm delete it.');
        // this.walletServ.deleteCurrentWallet();
        console.log(this.wallets);
        console.log('this.currentWalletIndex=' + this.currentWalletIndex);
        if (this.currentWalletIndex >= 0 && this.wallets) {
            
            this.wallets.splice(this.currentWalletIndex, 1);
        }
        console.log(this.wallets);
        if (this.wallets.length === this.currentWalletIndex) {
            this.currentWalletIndex = this.wallets.length - 1;
            await this.walletServ.saveCurrentWalletIndex(this.currentWalletIndex);
        }
        this.walletServ.updateWallets(this.wallets);    
        
    }

    async loadCoinsPrice() {
        this.coinsPrice = await this.apiServ.getCoinsPrice();

        this.coinsPrice.exgcoin = {
           usd: 0.2 
        };
    }
    async loadBalance() {
        
        // console.log('this.coinsPrice=');
        // console.log(this.coinsPrice);
        if (!this.wallet) {
            return;
        }
        
        let updated = false;
        for ( let i = 0; i < this.wallet.mycoins.length; i++ ) {
            const coin = this.wallet.mycoins[i];
            const balance = await this.coinServ.getBalance(coin);
            if (coin.balance !== balance.balance || coin.lockedBalance !== balance.lockbalance) {                        /*
                this.wallets = new Array<Wallet>();
                wallets.forEach(wl => { this.wallets.push(wl); });
                */
                coin.balance = balance.balance;
                coin.lockedBalance = balance.lockbalance;
                updated = true;
            }
        }
        if (updated) {
            console.log('updated=' + updated);
            this.walletServ.updateToWalletList(this.wallet, this.currentWalletIndex);
        }
    }

    async changeWallet(value) {
        this.currentWalletIndex = value;
        // this.wallet = this.wallets[this.currentWalletIndex];
        // this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.walletServ.saveCurrentWalletIndex(this.currentWalletIndex);
        console.log('this.currentWalletIndex=' + this.currentWalletIndex);
        await this.loadWallet(this.wallets[this.currentWalletIndex]);
    }
    
    async loadWallets() {
        this.wallets = await this.walletServ.getWallets();
        if (!this.wallets || this.wallets.length === 0) {
            this.route.navigate(['/wallet/create']);
            return;
        }
        this.currentWalletIndex = await this.walletServ.getCurrentWalletIndex();
        if (this.currentWalletIndex == null || this.currentWalletIndex < 0) {
            this.currentWalletIndex = 0;
        }
        if (this.currentWalletIndex > this.wallets.length - 1) {
            this.currentWalletIndex = this.wallets.length - 1;
        }        
    }

    refreshGas() {
        this.kanbanServ.getKanbanBalance(this.wallet.excoin.receiveAdds[0].address).subscribe(
            (resp: any) => {
                console.log('resp=', resp);
                const fab = this.utilServ.stripHexPrefix(resp.balance.FAB);
                this.gas = this.utilServ.hexToDec(fab) / 1e18;

            },
            error => {
                console.log('errorrrr=', error);
            }
        ); 
    }

    async loadWallet(wallet: Wallet) {
        this.wallet = wallet;
        console.log('this.wallet=', this.wallet);
        this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.exgBalance = this.wallet.mycoins[0].balance;
        console.log('load wallet again.');
        this.refreshGas();
    }
    exchangeMoney() {
        this.route.navigate(['/market/home']);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalServ.show(template);
    } 

    
    addGasFee() {
        // this.currentCoin = this.wallet.mycoins[1];
        this.addGasModal.show();
    }
    
    withdraw(currentCoin: MyCoin) {
        this.currentCoin = currentCoin;
        this.withdrawModal.show();        
    }

    deposit(currentCoin: MyCoin) {
        this.currentCoin = currentCoin;
        this.depositModal.show();
    }

    redeposit(currentCoin: MyCoin) {
        this.currentCoin = currentCoin;
        this.opType = 'redeposit';
        this.pinModal.show();
    }

    onConfirmedDepositAmount(amount: number) {
        this.amount = amount;
        this.opType = 'deposit';
        this.pinModal.show();
    }

    onConfirmedWithdrawAmount(amount: number) {
        this.amount = amount;
        this.opType = 'withdraw';
        this.pinModal.show();
    }

    onConfirmedLoginSetting(password: string) {
        console.log('new password=' + password);
        this.wallet = this.walletServ.updateWalletPassword(this.wallet, this.pin, password);
        this.walletServ.updateToWalletList(this.wallet, this.currentWalletIndex);
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
        const pinHash = this.utilServ.SHA256(pin).toString();
        if (pinHash !== this.wallet.pwdHash) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            return;
        }
        if (this.opType === 'deposit') {
            this.depositdo();
        } else 
        if (this.opType === 'redeposit') {
            this.redepositdo();
        } else
        if (this.opType === 'withdraw') {
            this.withdrawdo();
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
        } else 
        if (this.opType === 'deleteWallet') {
            this.deleteWalletModal.show();
        } else 
        if (this.opType === 'loginSetting') {
            this.loginSettingModal.show();
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
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
        }
    }

    backupPrivateKey() {
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        this.seed = seed;
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
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
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
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
        this.walletServ.updateToWalletList(this.wallet, this.currentWalletIndex);
    }

    async depositFab(currentCoin) {
        const amount = this.amount;
        const pin = this.pin;     
        
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
            return;   
        } 
        const scarAddress = await this.kanbanServ.getScarAddress();
        console.log('scarAddress=', scarAddress);
        const {txHash, errMsg} = await this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);
        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
        } else {

            const item = {
                walletId: this.wallet.id,
                type: 'Add Gas',
                coin: currentCoin.name,
                tokenType: currentCoin.tokenType,
                amount: amount,
                txid: txHash,
                time: new Date(),
                confirmations: '0',
                blockhash: '', 
                comment: '',
                status: 'pending'
            };
            this.storageService.storeToTransactionHistoryList(item);

            this.alertServ.openSnackBar('add gas transaction was submitted successfully.', 'Ok');
        }
    }

    async addGasDo() {
        const currentCoin = this.wallet.mycoins[1];
        this.depositFab(currentCoin);        
    }
    async sendCoinDo() {
        const pin = this.pin;
        const currentCoin = this.wallet.mycoins[this.sendCoinForm.coinIndex];

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

        const amount = this.sendCoinForm.amount;
        const doSubmit = true;
        const options = {
            gasPrice: this.sendCoinForm.gasPrice,
            gasLimit: this.sendCoinForm.gasLimit,
            satoshisPerByte: this.sendCoinForm.satoshisPerByte
        };
        const {txHex, txHash, errMsg} = await this.coinService.sendTransaction(currentCoin, seed, 
            this.sendCoinForm.to.trim(), amount, options, doSubmit
        );
        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
            return;
        }
        if (txHex && txHash) {
            this.alertServ.openSnackBar('your transaction was submitted successfully.', 'Ok');
            
            const item = {
                walletId: this.wallet.id,
                type: 'Send',
                coin: currentCoin.name,
                tokenType: currentCoin.tokenType,
                amount: amount,
                txid: txHash,
                time: new Date(),
                confirmations: '0',
                blockhash: '', 
                comment: this.sendCoinForm.comment,
                status: 'pending'
            };
            this.storageService.storeToTransactionHistoryList(item);
        }
    }

    async withdrawdo() {
        const currentCoin = this.currentCoin;

        const amount = this.amount;
        const pin = this.pin;

        const coinType = this.coinServ.getCoinTypeIdByName(currentCoin.name);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
            return;   
        }         
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);   
        const amountInLink = amount * 1e18; // it's for all coins.
        let addressInWallet = currentCoin.receiveAdds[0].address;
        if (currentCoin.name === 'BTC' || currentCoin.name === 'FAB') {
            const bytes = bs58.decode(addressInWallet);
            addressInWallet = bytes.toString('hex');
        }
        const abiHex = this.web3Serv.getWithdrawFuncABI(coinType, amountInLink, addressInWallet);  
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const includeCoin = true;
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        console.log('withdraw');
        console.log('abiHex=' + abiHex);
        console.log('keyPairsKanban.address=' + keyPairsKanban.address);
        console.log('coinPoolAddress=' + coinPoolAddress);
        console.log('nonce=' + nonce);
        console.log('includeCoin=' + includeCoin);        
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 

        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp: any) => { 
            console.log('resp=', resp);
            if (resp && resp.transactionHash) {
                const item = {
                    walletId: this.wallet.id, 
                    type: 'Withdraw',
                    coin: currentCoin.name,
                    tokenType: currentCoin.tokenType,
                    amount: amount,
                    txid: resp.transactionHash,
                    time: new Date(),
                    confirmations: '0',
                    blockhash: '', 
                    comment: '',
                    status: 'pending'
                };
                this.storageService.storeToTransactionHistoryList(item);
    
                this.alertServ.openSnackBar('Your withdraw request is pending.', 'Ok');  
            } else {
                this.alertServ.openSnackBar('Some error happened. Please try again.', 'Ok');  
            }
        });      
    }

    async redepositdo() {
        const redepositArray = this.currentCoin.redeposit;
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;
        if (redepositArray && redepositArray.length > 0) {
            let nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
            for (let i = 0; i < redepositArray.length; i++) {
                const redepositItem = redepositArray[i];
                const amount = redepositItem.amount;
                const coinType = redepositItem.coinType;
                const r = redepositItem.r;
                const s = redepositItem.s;
                const v = redepositItem.v;
                const transactionID = redepositItem.transactionID;
                this.submitrediposit( nonce ++, coinType, amount, r, s, v, transactionID);
            }
        }
    }

    async submitrediposit(nonce: number, coinType: number, amount: number, r: string, s: string, v: string, transactionID: string) {

        console.log('details for submitrediposit');
        console.log('nonce=' + nonce + ',coinType=' + coinType + ',amount=' + amount 
        + ',r=' + r + ',s=' + s + ',v=' + v + ',transactionID=' + transactionID);
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;
        const pin = this.pin;

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
            return;   
        }           
        const includeCoin = true;
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const signedMessage: Signature = {
            r: r,
            s: s,
            v: v
        };
        const abiHex = this.web3Serv.getDepositFuncABI(coinType, transactionID, amount, addressInKanban, signedMessage);
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 
        this.kanbanServ.submitReDeposit(txKanbanHex).subscribe((resp: any) => { 
            console.log('resp for submitrediposit=', resp);
        });        
    }

    async depositdo() {

        const currentCoin = this.currentCoin;

        const amount = this.amount;
        const pin = this.pin;

        const coinType = this.coinServ.getCoinTypeIdByName(currentCoin.name);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
            return;   
        }         
        const keyPairs = this.coinServ.getKeyPairs(currentCoin, seed, 0, 0);


        const officalAddress = this.coinServ.getOfficialAddress(currentCoin);
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;

        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);

        console.log('addressInKanban=', addressInKanban);
        console.log('keyPairsKanban.address=', keyPairsKanban.address);
        const doSubmit = false;
        const options = {};
        const {txHex, txHash, errMsg} = await this.coinServ.sendTransaction(
            currentCoin, seed, officalAddress, amount, options, doSubmit
        );   

        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
            return;
        }

        if (!txHex || !txHash) {
            this.alertServ.openSnackBar('Internal error for txHex or txHash', 'Ok');
            return;
        }
        const amountInLink = amount * 1e18; // it's for all coins.
        console.log('txHash111111111111111111111111111111111111111111111=' + txHash);
        const originalMessage = this.coinServ.getOriginalMessage(coinType, this.utilServ.stripHexPrefix(txHash)
        , amountInLink, this.utilServ.stripHexPrefix(addressInKanban));
        //console.log('a');
        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);
        //console.log('b');
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        //console.log('c');
        const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);
        //console.log('d');
        const nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
        //const nonce = 0;
        const includeCoin = true;
        //console.log('e');

        console.log('deposit');
        console.log('abiHex=' + abiHex);
        console.log('keyPairsKanban.address=' + keyPairsKanban.address);
        console.log('coinPoolAddress=' + coinPoolAddress);
        console.log('nonce=' + nonce);
        console.log('includeCoin=' + includeCoin);
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 
        //console.log('f');
        
        /*
        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp) => { 
            console.log('resp=' + resp);
        });         
        */
       
       
       this.kanbanServ.submitDeposit(txHex, txKanbanHex).subscribe((resp: any) => { 
            console.log('resp=', resp);
            if (resp.transactionID) {
                const item = {
                    walletId: this.wallet.id, 
                    type: 'Deposit',
                    coin: currentCoin.name,
                    tokenType: currentCoin.tokenType,
                    amount: amount,
                    txid: resp.transactionID,
                    time: new Date(),
                    confirmations: '0',
                    blockhash: '', 
                    comment: '',
                    status: 'pending'
                };
                this.storageService.storeToTransactionHistoryList(item);

                this.alertServ.openSnackBar('Adding deposit was submitted successfully.', 'Ok');
            }
       }); 
         
    }
}
