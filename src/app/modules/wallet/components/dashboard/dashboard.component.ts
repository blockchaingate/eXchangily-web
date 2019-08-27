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
import {CoinsPrice} from '../../../../interfaces/balance.interface';

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

    constructor ( private route: Router, private walletServ: WalletService, private modalServ: BsModalService, 
        private coinServ: CoinService, private utilServ: UtilService, private apiServ: ApiService, 
        private kanbanServ: KanbanService, private web3Serv: Web3Service, private viewContainerRef: ViewContainerRef) {
        this.showMyAssets = true;
        this.showTransactionHistory = false;
        this.loadWallet();
        this.loadBalance();
    }

    onShowMyAssets() {
        this.showMyAssets = true;
        this.showTransactionHistory = false;
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
        console.log(value);
        this.currentWalletIndex = value;
        this.wallet = this.wallets[this.currentWalletIndex];
        this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.walletServ.saveCurrentWalletIndex(value);
        
    }

    loadWallet() {
        console.log('loading storage...');
        this.walletServ.getWalletList().subscribe((wallets: Wallet[]) => {
            console.log('wallets in loading..');
            console.log(wallets);
            if (wallets) {
                this.currentWalletIndex = wallets.length - 1;
                
                this.walletServ.getCurrentWalletIndex().subscribe(
                    async (index: number) => {
                        if (index !== null) {
                            this.currentWalletIndex = index;
                        }
                        
                        console.log('this.currentWalletIndex===' + this.currentWalletIndex);
                        this.wallet = wallets[this.currentWalletIndex];
                        console.log('this.wallet is here');
                        console.log(this.wallet);
                        this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
                        this.gas = await this.kanbanServ.getGas(this.wallet.excoin.receiveAdds[0].address);
                        this.wallets = new Array<Wallet>();
                        wallets.forEach(wl => { this.wallets.push(wl); });
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
        this.pinModal.show();
    }

    addAssets() {
        this.addAssetsModal.show();
    }

    onConfirmedPin(pin: string) {
        console.log('pin is:' + pin);
        this.pin = pin;
        this.depositdo();
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

    depositFab(currentCoin) {
        const amount = this.amount;
        const pin = this.pin;     
        
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        this.coinServ.depositFab(seed, currentCoin, amount);

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

        // const amountInLink = amount * Math.pow(10, this.utilServ.getDecimal(currentCoin)); //for ethereum 

        const amountInLink = amount * 1e18; // it's for all coins.
        const originalMessage = this.coinServ.getOriginalMessage(coinType, txHash.substring(2), amountInLink, addressInKanban.substring(2));

        // console.log('address=' + keyPairs.address);
        // console.log('privateKey=' + keyPairs.privateKey);
        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);

        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();

        const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);

        const nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
        const includeCoin = true;
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 

        
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
