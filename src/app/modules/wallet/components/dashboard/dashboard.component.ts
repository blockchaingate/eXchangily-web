import { Component, ViewEncapsulation, TemplateRef, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
import { WalletService } from '../../../../services/wallet.service';
import { CoinService } from '../../../../services/coin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilService } from '../../../../services/util.service';
import { ApiService } from '../../../../services/api.service';
import { KanbanService } from '../../../../services/kanban.service';
import { Web3Service } from '../../../../services/web3.service';
import { Signature, Token } from '../../../../interfaces/kanban.interface';
import { DepositAmountModal } from '../../modals/deposit-amount/deposit-amount.modal';
import { RedepositAmountModal } from '../../modals/redeposit-amount/redeposit-amount.modal';
import { AddAssetsModal } from '../../modals/add-assets/add-assets.modal';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { DisplayPinNumberModal } from '../../../shared/modals/display-pin-number/display-pin-number.modal';
import { AddGasModal } from '../../modals/add-gas/add-gas.modal';
import { ShowSeedPhraseModal } from '../../modals/show-seed-phrase/show-seed-phrase.modal';
import { VerifySeedPhraseModal } from '../../modals/verify-seed-phrase/verify-seed-phrase.modal';
import { SendCoinModal } from '../../modals/send-coin/send-coin.modal';
import { BackupPrivateKeyModal } from '../../modals/backup-private-key/backup-private-key.modal';
import { DeleteWalletModal } from '../../modals/delete-wallet/delete-wallet.modal';
import { LoginSettingModal } from '../../modals/login-setting/login-setting.modal';
import { DisplaySettingModal } from '../../modals/display-setting/display-setting.modal';
import { CoinsPrice } from '../../../../interfaces/balance.interface';
import { SendCoinForm } from '../../../../interfaces/kanban.interface';
import { StorageService } from '../../../../services/storage.service';
import { AlertService } from '../../../../services/alert.service';
import { AngularCsv } from 'angular7-csv';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionItem } from '../../../../models/transaction-item';
import BigNumber from 'bignumber.js/bignumber';
import * as bs58 from 'bs58';
import { TimerService } from '../../../../services/timer.service';
import { WsService } from '../../../../services/ws.service';
import { environment } from '../../../../../environments/environment';
import { ManageWalletComponent } from '../manage-wallet/manage-wallet.component';
import { CampaignOrderService } from '../../../../services/campaignorder.service';
import { Pair } from 'src/app/modules/market/models/pair';

@Component({
    selector: 'app-wallet-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletDashboardComponent implements OnInit {
    @ViewChild('manageWallet', { static: true }) manageWallet: ManageWalletComponent;
    @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
    @ViewChild('displayPinModal', { static: true }) displayPinModal: DisplayPinNumberModal;
    @ViewChild('depositModal', { static: true }) depositModal: DepositAmountModal;
    @ViewChild('redepositModal', { static: true }) redepositModal: RedepositAmountModal;
    @ViewChild('addGasModal', { static: true }) addGasModal: AddGasModal;
    @ViewChild('addAssetsModal', { static: true }) addAssetsModal: AddAssetsModal;
    @ViewChild('sendCoinModal', { static: true }) sendCoinModal: SendCoinModal;
    @ViewChild('showSeedPhraseModal', { static: true }) showSeedPhraseModal: ShowSeedPhraseModal;
    @ViewChild('verifySeedPhraseModal', { static: true }) verifySeedPhraseModal: VerifySeedPhraseModal;
    @ViewChild('backupPrivateKeyModal', { static: true }) backupPrivateKeyModal: BackupPrivateKeyModal;
    @ViewChild('deleteWalletModal', { static: true }) deleteWalletModal: DeleteWalletModal;
    @ViewChild('loginSettingModal', { static: true }) loginSettingModal: LoginSettingModal;
    @ViewChild('displaySettingModal', { static: true }) displaySettingModal: DisplaySettingModal;

    sendCoinForm: SendCoinForm;
    wallet: Wallet;
    wallets: Wallet[];
    modalRef: BsModalRef;
    checked = true;
    exgAddress: string;
    fabAddress: string;
    exgBalance: number;
    currentWalletIndex: number;
    pairsConfig: Pair[];
    currentCoin: MyCoin;
    amount: number;
    amountForm: any;
    fabBalance: number;
    ethBalance: number;
    coinsPrice: CoinsPrice;
    pin: string;
    seed: Buffer;
    hideSmall: boolean;
    showMyAssets: boolean;
    showTransactionHistory: boolean;
    gas: number;
    alertMsg: string;
    opType: string;
    currentCurrency: string;
    currencyRate: number;
    lan = 'en';

    constructor(
        private campaignorderServ: CampaignOrderService,
        private route: Router, private walletServ: WalletService, private modalServ: BsModalService,
        private coinServ: CoinService, public utilServ: UtilService, private apiServ: ApiService, private _wsServ: WsService,
        private kanbanServ: KanbanService, private web3Serv: Web3Service, private viewContainerRef: ViewContainerRef,
        private alertServ: AlertService, private matIconRegistry: MatIconRegistry, private timerServ: TimerService,
        private coinService: CoinService, private storageService: StorageService, private domSanitizer: DomSanitizer) {
        this.lan = localStorage.getItem('Lan');
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
        // console.log('coinName=' + coinName);
        let interval = 3000;
        if (coinName === 'FAB') {
            interval = 8000;
        }
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const coin = this.wallet.mycoins[i];
            // console.log('coin.name=' + coin.name);
            if (coin.name === coinName) {
                for (let j = 0; j < 20; j++) {
                    await new Promise(resolve => setTimeout(resolve, interval));
                    const balance = await this.coinServ.getBalance(coin);
                    if (coin.balance !== balance.balance || coin.lockedBalance !== balance.lockbalance) {
                        // console.log('you got it');
                        coin.balance = balance.balance;
                        coin.lockedBalance = balance.lockbalance;
                        break;
                    }
                }

            }
        }
    }

    async ngOnInit() {
        this.setPairsConfig();

        await this.loadWallets();
        // this.currentWalletIndex = await this.walletServ.getCurrentWalletIndex();
        // console.log('this.currentWalletIndex=', this.currentWalletIndex);
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
            /*
            if (this.exgAddress === '0x5ccab4dd9c83d675b25e6589561f4ee1e185a0b7') {
                this.exgAddress = '';
                for (let i = 0; i < this.wallet.mycoins.length; i++) {
                    this.wallet.mycoins[i].receiveAdds[0].address = '';
                }
            }
            */

            this.kanbanServ.getDepositErr(this.exgAddress).subscribe(
                (resp: any) => {
                    // console.log('resp=', resp);
                    for (let j = 0; j < this.wallet.mycoins.length; j++) {
                        this.wallet.mycoins[j].redeposit = [];
                    }
                    for (let i = 0; i < resp.length; i++) {
                        const coinType = resp[i].coinType;
                        for (let j = 0; j < this.wallet.mycoins.length; j++) {
                            const name = this.wallet.mycoins[j].name;
                            const myCoinType = this.coinServ.getCoinTypeIdByName(name);
                            // console.log('coinType=' + coinType + ',myCoinType=' + myCoinType);
                            if (coinType === myCoinType) {
                                //  console.log('got it');
                                if (!this.wallet.mycoins[j].redeposit) {
                                    this.wallet.mycoins[j].redeposit = [];
                                }
                                this.wallet.mycoins[j].redeposit.push(resp[i]);
                            }
                        }
                    }
                    // console.log('this.wallet.mycoinsssssssss===', this.wallet.mycoins);
                }
            );
        }
        /*
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
        */
    }

    setPairsConfig() {
        if (this.pairsConfig) { return; }

        let strPairsConfig = sessionStorage.getItem('pairsConfig');
        if (!strPairsConfig) {
            this.kanbanServ.getPairConfig().subscribe(
                res => {
                    strPairsConfig = JSON.stringify(res);
                    sessionStorage.setItem('pairsConfig', strPairsConfig);
                    this.pairsConfig = <Pair[]>res;
                },
                err => { this.alertMsg = err.message; });
        } else {
            this.pairsConfig = <Pair[]>(JSON.parse(strPairsConfig));
        }
    }

    getPairConfig(pairName: string): Pair {
        if (!this.pairsConfig) { return null; }

        pairName = pairName.toLocaleUpperCase();
        const pairConfig = <Pair>this.pairsConfig.find(item => item.name === pairName);
        return pairConfig;
    }

    copyAddress() {
        this.utilServ.copy(this.fabAddress);
    }

    onConfirmedBackupPrivateKey(cmd: string) {
        // console.log('onConfirmedBackupPrivateKey start, cmd=', cmd);

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
            let receiveAddsLength = 1;
            if (coin.receiveAdds.length < receiveAddsLength) {
                receiveAddsLength = coin.receiveAdds.length;
            }
            for (let j = 0; j < receiveAddsLength; j++) {
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

            /*
            let changeAddsLength = 1;
            if (coin.changeAdds.length < changeAddsLength) {
                changeAddsLength = coin.changeAdds.length;
            }            
            for (let j = 0; j < changeAddsLength; j++) {
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
            */
        }
        const csv = new AngularCsv(data, 'Private Keys for wallet ' + this.wallet.name, options);
    }

    onShowMyAssets() {
        this.showMyAssets = true;
        this.showTransactionHistory = false;
    }

    onmanageWallet(type: string) {
        // console.log('type in dashboard=' + type);
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
                        } else
                            if (type === 'DISPLAY_SETTING') {
                                this.opType = 'displaySetting';
                                this.pinModal.show();
                            } else
                                if (type === 'SMART_CONTRACT') {
                                    this.route.navigate(['/smartcontract']);
                                    return;
                                } else
                                    if (type === 'HIDE_SHOW_WALLET') {
                                        if (this.wallet.hide) {
                                            this.opType = 'showWallet';
                                            this.displayPinModal.show();
                                        } else {
                                            this.toggleWalletHide();
                                        }
                                    }
    }

    onShowTransactionHistory() {
        this.showMyAssets = false;
        this.showTransactionHistory = true;
    }

    async onConfirmedDeleteWallet() {
        // console.log('confirm delete it.');
        // this.walletServ.deleteCurrentWallet();
        // console.log(this.wallets);
        // console.log('this.currentWalletIndex=' + this.currentWalletIndex);
        if (this.currentWalletIndex >= 0 && this.wallets) {

            this.wallets.splice(this.currentWalletIndex, 1);
        }
        // console.log(this.wallets);
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
        this._wsServ.currentPrices.subscribe((arr: any) => {
            // console.log('arr===', arr);
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                // console.log('item=', item);
                if (item.symbol === 'EXGUSDT') {
                    const price = item.price;
                    // console.log('price===', price);
                    const thisPairConfig: Pair = this.getPairConfig(item.symbol);
                    if (thisPairConfig) {
                        const priceAmount = this.utilServ.showAmount(price, thisPairConfig.priceDecimal);
                        // console.log('priceAmount====', priceAmount);
                        this.coinsPrice.exgcoin.usd = Number(priceAmount);
                    }
                    break;
                }
            }
        });

    }

    async loadBalance() {
        // console.log('this.coinsPrice=');
        // console.log(this.coinsPrice);
        if (!this.wallet) {
            return;
        }

        let updated = false;
        let hasDUSD = false;
        let exgCoin;
        let fabCoin;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const coin = this.wallet.mycoins[i];
            const balance = await this.coinServ.getBalance(coin);
            if (coin.name === 'DUSD') {
                hasDUSD = true;
            } else
                if (coin.name === 'EXG') {
                    exgCoin = coin;
                } else
                    if (coin.name === 'FAB') {
                        fabCoin = coin;
                        this.fabBalance = balance.balance;
                    } else
                        if (coin.name === 'ETH') {
                            this.ethBalance = balance.balance;
                        }

            if (coin.balance !== balance.balance || coin.lockedBalance !== balance.lockbalance) {
                /*
                this.wallets = new Array<Wallet>();
                wallets.forEach(wl => { this.wallets.push(wl); });
                */
                coin.balance = balance.balance;
                // coin.receiveAdds[0].balance = balance.balance;
                coin.lockedBalance = balance.lockbalance;
                updated = true;
            }
        }
        if (!hasDUSD) {
            const dusdCoin = new MyCoin('DUSD');
            dusdCoin.balance = 0;
            dusdCoin.decimals = 6;
            dusdCoin.coinType = environment.CoinType.FAB;
            dusdCoin.lockedBalance = 0;
            dusdCoin.receiveAdds.push(exgCoin.receiveAdds[0]);
            dusdCoin.tokenType = 'FAB';
            dusdCoin.baseCoin = fabCoin;
            dusdCoin.contractAddr = environment.addresses.smartContract.DUSD;
            this.wallet.mycoins.push(dusdCoin);
            updated = true;
        }
        if (updated) {
            // console.log('updated=' + updated);
            this.walletServ.updateToWalletList(this.wallet, this.currentWalletIndex);
        }
    }

    async changeWallet(value) {
        this.currentWalletIndex = value;
        // this.wallet = this.wallets[this.currentWalletIndex];
        // this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.walletServ.saveCurrentWalletIndex(this.currentWalletIndex);
        // console.log('this.currentWalletIndex=' + this.currentWalletIndex);
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
                // console.log('resp=', resp);
                const fab = this.utilServ.stripHexPrefix(resp.balance.FAB);
                this.gas = this.utilServ.hexToDec(fab) / 1e18;

            },
            error => {
                // console.log('errorrrr=', error);
            }
        );
    }

    async loadWallet(wallet: Wallet) {
        this.wallet = wallet;

        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const coin = this.wallet.mycoins[i];
            const balance = coin.receiveAdds[0].balance;
            const address = coin.receiveAdds[0].address;
            if (coin.name === 'FAB') {
                this.fabBalance = balance;
                this.fabAddress = address;
            } else
                if (coin.name === 'ETH') {
                    this.ethBalance = balance;
                }
        }
        // console.log('this.wallet=', this.wallet);
        this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        this.exgBalance = this.wallet.mycoins[0].balance;

        this.campaignorderServ.getCheck(this.exgAddress).subscribe(
            (resp: any) => {
                console.log('resp for getCheck=', resp);
                if (resp.ok) {
                    if (resp._body && resp._body.totalQuantities > 0) {
                        this.alertMsg = 'Disqualified with campaign';
                        if (this.lan === 'zh') {
                            this.alertMsg = '未达推广资格';
                        }

                    } else {
                        this.alertMsg = '';
                    }
                    console.log('this.alertMsg==', this.alertMsg);
                } else {
                    this.alertMsg = '';
                }
            }
        );
        // console.log('load wallet again.');
        this.refreshGas();
    }
    exchangeMoney() {
        this.route.navigate(['/market/home']);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalServ.show(template);
    }

    addGasFee() {
        if (this.fabBalance < 0.5) {
            return;
        }
        // this.currentCoin = this.wallet.mycoins[1];
        this.addGasModal.show();
    }

    deposit(currentCoin: MyCoin) {
        this.currentCoin = currentCoin;
        this.depositModal.initForm(currentCoin);
        this.depositModal.show();
    }

    redeposit(currentCoin: MyCoin) {
        this.currentCoin = currentCoin;
        console.log('this.currentCoin===', this.currentCoin);
        // this.opType = 'redeposit';
        // this.pinModal.show();
        if (this.currentCoin && this.currentCoin.redeposit && this.currentCoin.redeposit.length > 0) {
            this.redepositModal.setTransactionID(this.currentCoin.redeposit[0].transactionID);
        }

        this.redepositModal.show();
    }

    onConfirmedDepositAmount(amountForm: any) {

        let fabBalance = 0;
        let ethBalance = 0;
        let btcBalance = 0;
        const amount = amountForm.amount;
        const transFee = amountForm.transFee;
        const tranFeeUnit = amountForm.tranFeeUnit;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            if (this.wallet.mycoins[i].name === 'FAB') {
                fabBalance = this.wallet.mycoins[i].balance;
            } else if (this.wallet.mycoins[i].name === 'ETH') {
                ethBalance = this.wallet.mycoins[i].balance;
            } else if (this.wallet.mycoins[i].name === 'BTC') {
                btcBalance = this.wallet.mycoins[i].balance;
            }
        }

        const currentCoinBalance = this.currentCoin.balance;
        const coinName = this.currentCoin.name;
        if (currentCoinBalance < amount) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar(coinName + '余额不足', 'Ok');
            } else {
                this.alertServ.openSnackBar('Insufficient ' + coinName + ' for this transaction', 'Ok');
            }
            return;
        }
        if (tranFeeUnit === 'BTC') {
            if (transFee > btcBalance) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('BTC余额不足', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Insufficient BTC for this transaction', 'Ok');
                }
                return;
            }
        } else
            if (tranFeeUnit === 'FAB') {
                if (transFee > fabBalance) {
                    this.alertServ.openSnackBar('Insufficient FAB for this transaction', 'Ok');
                    return;
                }
            } else
                if (tranFeeUnit === 'ETH') {
                    if (transFee > ethBalance) {
                        if (this.lan === 'zh') {
                            this.alertServ.openSnackBar('ETH余额不足', 'Ok');
                        } else {
                            this.alertServ.openSnackBar('Insufficient ETH for this transaction', 'Ok');
                        }
                        return;
                    }
                }

        if ((coinName === 'BTC') || (coinName === 'ETH') || (coinName === 'FAB')) {
            if (currentCoinBalance < amount + transFee) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar(coinName + '余额不足', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Insufficient ' + coinName + ' for this transaction', 'Ok');
                }
                return;
            }
        }
        this.amountForm = amountForm;
        this.opType = 'deposit';
        this.pinModal.show();
    }

    onConfirmedRedepositAmount(amountForm: any) {
        this.amountForm = amountForm;
        this.opType = 'redeposit';
        this.pinModal.show();
    }

    onConfirmedLoginSetting(password: string) {
        console.log('new password=' + password);
        this.wallet = this.walletServ.updateWalletPassword(this.wallet, this.pin, password);
        this.walletServ.updateToWalletList(this.wallet, this.currentWalletIndex);
    }

    onConfirmedDisplaySetting(password: string) {
        console.log('new password=' + password);
        this.wallet = this.walletServ.updateWalletDisplayPassword(this.wallet, password);
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
        this.pin = pin;
        const pinHash = this.utilServ.SHA256(pin).toString();
        if (pinHash !== this.wallet.pwdHash) {
            this.warnPwdErr();
            return;
        }
        if (this.opType === 'deposit') {
            this.depositdo();
        } else
            if (this.opType === 'redeposit') {
                this.redepositdo();
            } else
                if (this.opType === 'redeposit') {
                    this.redepositdo();
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
                                            } else
                                                if (this.opType === 'displaySetting') {
                                                    this.displaySettingModal.show();
                                                }
    }

    onConfirmedDisplayPin(pin: string) {
        this.pin = pin;
        const pinHash = this.utilServ.SHA256(pin).toString();
        console.log('this.wallet.pwdDisplayHash==', this.wallet.pwdDisplayHash);
        if (pinHash !== this.wallet.pwdDisplayHash) {
            this.warnPwdErr();
            return;
        }
        this.toggleWalletHide();
    }
    toggleWalletHide() {
        this.wallet.hide = !this.wallet.hide;
        this.manageWallet.changeHideWallet();
        this.walletServ.updateWallets(this.wallets);
    }

    showSeedPhrase() {
        let seedPhrase = '';
        if (this.wallet.encryptedMnemonic) {
            seedPhrase = this.utilServ.aesDecrypt(this.wallet.encryptedMnemonic, this.pin);

            /*
            const seed = this.utilServ.aesDecrypt(this.wallet.encryptedSeed, this.pin);
            const id = this.wallet.id;
            console.log('id=', id);
            console.log('seedPhrase=', seedPhrase);
            console.log('seed=', seed);
            */
        }
        if (seedPhrase) {
            this.showSeedPhraseModal.show(seedPhrase);
        } else {
            this.warnPwdErr();
        }
    }

    warnPwdErr() {
        if (this.lan === 'zh') {
            this.alertServ.openSnackBar('密码错误', 'Ok');
        } else {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
        }
    }

    backupPrivateKey() {
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        this.seed = seed;
        if (!seed) {
            this.warnPwdErr();
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
            this.warnPwdErr();
        }
    }

    onConfirmedAssets(assets: [Token]) {
        for (let i = 0; i < assets.length; i++) {
            const token = assets[i];
            const type = token.type;
            const name = token.name;
            const addr = token.address;
            const decimals = token.decimals;
            for (let j = 0; j < 5; j++) {
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
            this.warnPwdErr();
            return;
        }
        const scarAddress = await this.kanbanServ.getScarAddress();
        console.log('scarAddress=', scarAddress);
        const { txHash, errMsg } = await this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);
        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
        } else {
            const addrs = environment.addresses.exchangilyOfficial.map(({ name }) => 'FAB');

            const item: TransactionItem = {
                walletId: this.wallet.id,
                type: 'Add Gas',
                coin: currentCoin.name,
                tokenType: currentCoin.tokenType,
                amount: amount,
                txid: txHash,
                to: addrs[0],
                time: new Date(),
                confirmations: '0',
                blockhash: '',
                comment: '',
                status: 'pending'
            };
            this.storageService.storeToTransactionHistoryList(item);

            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('加燃料交易提交成功，请等40分钟后查看结果', 'Ok');
            } else {
                this.alertServ.openSnackBar('Add gas transaction was submitted successfully, please check gas balance 40 minutes later.', 'Ok');
            }
        }
    }

    async addGasDo() {
        /*
        if (environment.production) {
            this.alertServ.openSnackBar('Not available in production', 'Ok');
            return;
        }
        */
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
            satoshisPerBytes: this.sendCoinForm.satoshisPerBytes
        };
        console.log('currenCoin=====', currentCoin);
        console.log('addr=', this.sendCoinForm.to.trim());
        const { txHex, txHash, errMsg } = await this.coinService.sendTransaction(currentCoin, seed,
            this.sendCoinForm.to.trim(), amount, options, doSubmit
        );
        console.log('errMsg for sendcoin=', errMsg);
        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
            return;
        }
        if (txHex && txHash) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('交易提交成功，请等一会查看结果', 'Ok');
            } else {
                this.alertServ.openSnackBar('your transaction was submitted successful, please wait a while to check status.', 'Ok');
            }

            const item = {
                walletId: this.wallet.id,
                type: 'Send',
                coin: currentCoin.name,
                tokenType: currentCoin.tokenType,
                amount: amount,
                txid: txHash,
                to: this.sendCoinForm.to.trim(),
                time: new Date(),
                confirmations: '0',
                blockhash: '',
                comment: this.sendCoinForm.comment,
                status: 'pending'
            };
            console.log('before next');
            this.timerServ.transactionStatus.next(item);
            this.timerServ.checkTransactionStatus(item);
            console.log('after next');
            this.storageService.storeToTransactionHistoryList(item);
        }
    }

    async redepositdo() {
        if (!this.amountForm) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('没有待确认的转币去交易所输入', 'Ok');
            } else {
                this.alertServ.openSnackBar('No input for confirmation of moving fund to DEX', 'OK');
            }
            return;
        }
        const transactionID = this.amountForm.transactionID;
        const gasPrice = Number(this.amountForm.gasPrice);
        const gasLimit = Number(this.amountForm.gasLimit);

        if (!transactionID || !gasPrice || !gasLimit) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('没有转币去交易所输入', 'Ok');
            } else {
                this.alertServ.openSnackBar('invalid input for moving fund to DEX', 'OK');
            }
            return;
        }

        const redepositArray = this.currentCoin.redeposit;
        // const addressInKanban = this.wallet.excoin.receiveAdds[0].address;
        if (redepositArray && redepositArray.length > 0) {

            for (let i = 0; i < redepositArray.length; i++) {
                const redepositItem = redepositArray[i];
                const amount = new BigNumber(redepositItem.amount);
                const coinType = redepositItem.coinType;
                const r = redepositItem.r;
                const s = redepositItem.s;
                const v = redepositItem.v;
                const txid = redepositItem.transactionID;
                if (txid !== transactionID) {
                    continue;
                }

                console.log('transactionID===', transactionID);
                this.submitrediposit(coinType, amount, transactionID, gasPrice, gasLimit);
            }
        }
    }

    async submitrediposit(coinType: number, amount: BigNumber, transactionID: string, gasPrice: number, gasLimit: number) {
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;
        const nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
        const pin = this.pin;

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

        if (!seed) {
            this.warnPwdErr();
            return;
        }

        const amountInLink = amount; // it's for all coins.
        const originalMessage = this.coinServ.getOriginalMessage(coinType, this.utilServ.stripHexPrefix(transactionID)
            , amountInLink, this.utilServ.stripHexPrefix(addressInKanban));

        console.log('originalMessage=', originalMessage);
        const coinName = this.coinServ.getCoinNameByTypeId(coinType);

        let currentCoin;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            if (this.wallet.mycoins[i].name === coinName) {
                currentCoin = this.wallet.mycoins[i];
            }
        }
        if (!currentCoin) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('币类型错误', 'Ok');
            } else {
                this.alertServ.openSnackBar('Your coin type is invalid.', 'Ok');
            }
            return;
        }

        const keyPairs = this.coinServ.getKeyPairs(currentCoin, seed, 0, 0);
        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);

        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        /*
        const signedMessage: Signature = {
            r: r,
            s: s,
            v: v
        };
        */
        /*
        console.log('r=', r);
        console.log('signedMessage.r=', signedMessage.r);
        console.log('s=', s);
        console.log('signedMessage.s=', signedMessage.s);
        console.log('v=', v);
        console.log('signedMessage.v=', signedMessage.v);
*/
        const abiHex = this.web3Serv.getDepositFuncABI(coinType, transactionID, amount, addressInKanban, signedMessage);
        console.log('abiHex for redeposit===');
        console.log(abiHex);
        const options = {
            gasPrice: gasPrice,
            gasLimit: gasLimit
        };
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, options);
        this.kanbanServ.submitReDeposit(txKanbanHex).subscribe((resp: any) => {
            console.log('resp for submitrediposit=', resp);
            if (resp.success) {
                // const txid = resp.data.transactionID;
                this.kanbanServ.incNonce();
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('确认交易所入币成功提交', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Confirmation was submitted successfully.', 'Ok');
                }
            }
        },
            (error: any) => {
                console.log('error=', error);
                let message = 'Unknown error while confirm moving fund to DEX.';
                if (this.lan === 'zh') {
                    message = '确认交易所入币时发生未知错误';
                }
                if (error.message) {
                    message = error.message;
                } else
                    if (error.error && error.error.message) {
                        message = error.error.message;
                    }
                this.alertServ.openSnackBar(error.error.message, 'ok');
            });
    }

    /*
                amount: amount,resp
                gasPrice: gasPrresp
                gasLimit: gasLiresp
                satoshisPerByteresposhisPerBytes,
                kanbanGasPrice:respnGasPrice,
                kanbanGasLimit:respnGasLimit
    */

    async depositdo() {
        const currentCoin = this.currentCoin;

        const amount = this.amountForm.amount;
        const pin = this.pin;

        const coinType = this.coinServ.getCoinTypeIdByName(currentCoin.name);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.warnPwdErr();
            return;
        }
        const keyPairs = this.coinServ.getKeyPairs(currentCoin, seed, 0, 0);

        const officalAddress = this.coinServ.getOfficialAddress(currentCoin);
        if (!officalAddress) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar(currentCoin.name + '官方地址无效', 'Ok');
            } else {
                this.alertServ.openSnackBar('offical address for ' + currentCoin.name + ' is unavailable', 'Ok');
            }
            return;
        }
        const addressInKanban = this.wallet.excoin.receiveAdds[0].address;
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);

        const doSubmit = false;
        const options = {
            gasPrice: this.amountForm.gasPrice,
            gasLimit: this.amountForm.gasLimit,
            satoshisPerBytes: this.amountForm.satoshisPerBytes
        };
        const { txHex, txHash, errMsg } = await this.coinServ.sendTransaction(
            currentCoin, seed, officalAddress, amount, options, doSubmit
        );

        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
            return;
        }

        if (!txHex || !txHash) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('txHash内部错误', 'Ok');
            } else {
                this.alertServ.openSnackBar('Internal error for txHex or txHash', 'Ok');
            }
            return;
        }
        const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.
        const originalMessage = this.coinServ.getOriginalMessage(coinType, this.utilServ.stripHexPrefix(txHash)
            , amountInLink, this.utilServ.stripHexPrefix(addressInKanban));

        console.log('originalMessage=', originalMessage);

        const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);

        console.log('signedMessage=', signedMessage);

        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);

        console.log('abiHex=', abiHex);
        const nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
        // const nonce = await this.kanbanServ.getNonce(addressInKanban);
        // console.log('nonce there we go =', nonce);
        const optionsKanban = {
            gasPrice: this.amountForm.kanbanGasPrice,
            gasLimit: this.amountForm.kanbanGasLimit,
        };
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, optionsKanban);

        console.log('txKanbanHex=', txKanbanHex);
        // return 0;
        this.kanbanServ.submitDeposit(txHex, txKanbanHex).subscribe((resp: any) => {
            // console.log('resp=', resp);
            if (resp && resp.data && resp.data.transactionID) {
                const item = {
                    walletId: this.wallet.id,
                    type: 'Deposit',
                    coin: currentCoin.name,
                    tokenType: currentCoin.tokenType,
                    amount: amount,
                    txid: resp.data.transactionID,
                    to: officalAddress,
                    time: new Date(),
                    confirmations: '0',
                    blockhash: '',
                    comment: '',
                    status: 'pending'
                };
                this.storageService.storeToTransactionHistoryList(item);
                this.timerServ.transactionStatus.next(item);
                this.timerServ.checkTransactionStatus(item);
                this.kanbanServ.incNonce();
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('转币去交易所提交成功', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Moving fund to DEX submitted successfully.', 'Ok');
                }
            } else
                if (resp.error) {
                    this.alertServ.openSnackBar(resp.error, 'Ok');
                }
        },
            error => {
                console.log('error====');
                console.log(error);
                if (error.message) {
                    this.alertServ.openSnackBar(error.message, 'Ok');
                }
            }
        );

    }
}
