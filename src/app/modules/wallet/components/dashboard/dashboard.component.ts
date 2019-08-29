import { Component, ViewEncapsulation, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ShowSeedPhraseModal } from '../../modals/show-seed-phrase/show-seed-phrase.modal';
import { SendCoinModal } from '../../modals/send-coin/send-coin.modal';
import {CoinsPrice} from '../../../../interfaces/balance.interface';
import {SendCoinForm} from '../../../../interfaces/kanban.interface';
import {StorageService} from '../../../../services/storage.service';

@Component({
    selector: 'app-wallet-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletDashboardComponent {
    @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
    @ViewChild('depositModal', {static: true}) depositModal: DepositAmountModal;
    @ViewChild('addAssetsModal', {static: true}) addAssetsModal: AddAssetsModal;
    @ViewChild('sendCoinModal', {static: true}) sendCoinModal: SendCoinModal;
    @ViewChild('showSeedPhraseModal', {static: true}) showSeedPhraseModal: ShowSeedPhraseModal;

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
    showMyAssets: boolean;
    showTransactionHistory: boolean;
    gas: number;
    opType: string;

    constructor ( private route: Router, private walletServ: WalletService, private modalServ: BsModalService, 
        private coinServ: CoinService, private utilServ: UtilService, private apiServ: ApiService, 
        private kanbanServ: KanbanService, private web3Serv: Web3Service, private viewContainerRef: ViewContainerRef,
        private utilService: UtilService, 
        private coinService: CoinService, private storageService: StorageService) {
        this.showMyAssets = true;
        this.showTransactionHistory = false;
        this.loadWallet();
        this.loadBalance();
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
        this.wallet = this.wallets[this.currentWalletIndex];
        this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.walletServ.saveCurrentWalletIndex(value);
        
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
        this.currentCoin = null;
        this.depositModal.show();
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
        console.log('amount is:' + amount);
        this.amount = amount;
        this.opType = 'deposit';
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
        if (this.opType === 'sendCoin') {
            this.sendCoinDo();
        } else 
        if (this.opType === 'showSeedPhrase') {
            this.showSeedPhrase();
        }
    }

    showSeedPhrase() {
        let seedPhrase = '';
        if(this.wallet.encryptedMnemonic) {
            seedPhrase = this.utilServ.aesDecrypt(this.wallet.encryptedMnemonic, this.pin);
        }
        this.showSeedPhraseModal.show(seedPhrase);
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

        //const scarAddress = await this.kanbanServ.getScarAddress();
        const scarAddress = '98cda3da6813b4711d7f0c1637480b2353b00c1c';
        console.log('scarAddress=', scarAddress);
        this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);

    }

    async sendCoinDo() {
        const pin = this.pin;
        const currentCoin = this.wallet.mycoins[this.sendCoinForm.coinIndex];

        const seed = this.utilService.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        
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

        if (currentCoin == null) {
            currentCoin = this.wallet.mycoins[1];
            this.depositFab(currentCoin);
            return;
        }       

        const amount = this.amount;
        const pin = this.pin;

        const coinType = this.coinServ.getCoinTypeIdByName(currentCoin.name);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        
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
            return;
        }


        const amountInLink = amount * 1e18; // it's for all coins.
        const originalMessage = this.coinServ.getOriginalMessage(coinType, txHash.substring(2), amountInLink, addressInKanban.substring(2));
        console.log('a');
        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);
        console.log('b');
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        console.log('c');
        const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);
        console.log('d');
        let nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
        //const nonce = 0;
        const includeCoin = true;
        console.log('e');
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 
        console.log('f');
        
        
        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp) => { 
            console.log('resp=' + resp);
        });         
        
       
       /*
       this.kanbanServ.submitDeposit(txHex, txKanbanHex).subscribe((resp) => { 
            console.log('resp=' + resp);
        }); 
        */    
    }
}
