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
import {Signature} from '../../../../interfaces/kanban.interface';
import { DepositAmountModal } from '../../modals/deposit-amount/deposit-amount.modal';

@Component({
    selector: 'app-wallet-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletDashboardComponent {
    //@ViewChild('childModal') childModal: DepositAmountModal;

    wallet: Wallet; 
    wallets: Wallet[];
    modalRef: BsModalRef;
    checked = true;
    exgAddress: string;
    currentWalletIndex: number;
    constructor ( private route: Router, private walletServ: WalletService, private modalServ: BsModalService, 
        private coinServ: CoinService, private utilServ: UtilService, private apiServ:ApiService, 
        private kanbanServ: KanbanService, private web3Serv: Web3Service, private viewContainerRef: ViewContainerRef) {
        this.loadWallet();
        this.loadBalance();
    }

    async loadBalance() {
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
                    (index: number) => {
                        if (index !== null) {
                            this.currentWalletIndex = index;
                        }
                        
                        console.log('this.currentWalletIndex===' + this.currentWalletIndex);
                        this.wallet = wallets[this.currentWalletIndex];
                        console.log('this.wallet is here');
                        console.log(this.wallet);
                        this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
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
    
    deposit(currentCoin: MyCoin) {
        //this.childModal.show();
    }

    async depositdo(currentCoin: MyCoin) {
        const amount = 15;
        const pin = '1qaz@WSX';

        const coinType = this.coinServ.getCoinTypeIdByName(currentCoin.name);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        
        const keyPairs = this.coinServ.getKeyPairs(currentCoin, seed, 0, 0);
        const officalAddress = this.coinServ.getOfficialAddress(currentCoin);
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;

        const txHash = await this.coinServ.sendTransaction(currentCoin, seed, officalAddress, amount);   
        
        if (!txHash) {
            return;
        }

        const originalMessage = this.coinServ.getOriginalMessage(coinType, txHash.substring(2), amount, addressInKanban.substring(2));

        //console.log('address=' + keyPairs.address);
        //console.log('privateKey=' + keyPairs.privateKey);
        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);

        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();

        const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amount, addressInKanban, signedMessage);

        const txhex = this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairs.privateKey, coinPoolAddress); 
        console.log('txhex=' + txhex);
        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp) => { 
            console.log('resp=' + resp);
        });         

    }
}
