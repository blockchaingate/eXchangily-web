import { Component, OnInit, ViewChild } from '@angular/core';
import { appId } from '../../../../landing/app.constants';

import { environment } from '../../../../../../environments/environment';
import { Wallet } from '../../../../../models/wallet';
import { MyCoin } from '../../../../../models/mycoin';
import { PinNumberModal } from '../../../../shared/modals/pin-number/pin-number.modal';
import { AlertService } from '../../../../../services/alert.service';
import { UtilService } from '../../../../../services/util.service';
import { WalletService } from '../../../../../services/wallet.service';
import { StorageService } from '../../../../../services/storage.service';
import { OtcService } from '../../../../../services/otc.service';
import { CoinService } from '../../../../../services/coin.service';
import { TimerService } from '../../../../../services/timer.service';

@Component({
    selector: 'app-otc-listing',
    templateUrl: './otc-listing.component.html',
    styleUrls: ['./otc-listing.component.scss']
})
export class OtcListingComponent implements OnInit {
    maxLimit: number;
    buy: boolean;
    coin: string;
    fiat: string;
    advType: string;
    price: number;
    listings: any;
    wallet: Wallet;
    gasPrice: number;
    txid: string;
    available: number;
    gasLimit: number;
    satoshisPerBytes: number;
    currentCoin: MyCoin;
    quantity: number;
    qtyLimitPerOrderLow: number;
    qtyLimitPerOrderHigh: number;
    notes: string;
    token: string;
    @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
    commissionRate = environment.OTC_COMMISSION_RATE;
    paymethods = ['E-Transfer'];
    fiats: string[] = [
        'USD',
        'CAD',
        'CNY'
    ];
    lan = 'en';

    constructor(
        private timerServ: TimerService,
        private coinService: CoinService,
        private walletService: WalletService,
        private alertServ: AlertService,
        public utilServ: UtilService,
        private storageService: StorageService,
        private _otcServ: OtcService) { }

    async ngOnInit() {
        this.lan = localStorage.getItem('Lan');

        this.txid = '';
        this.buy = true;
        this.coin = 'USDT';
        this.fiat = 'USD';
        this.advType = 'ongoing';
        this.wallet = await this.walletService.getCurrentWallet();
        this.storageService.getToken().subscribe(
            (token: any) => {
                this.token = token;
                this._otcServ.getListings(this.token).subscribe(
                    (res: any) => {
                        if (res && res.ok) {
                            this.listings = res._body;
                        }
                    }
                );
            }
        );
    }

    addListing() {

        /*
        if (!this.buy) { // sell coins
            const payableQuantity = this.quantity * (1 + this.commissionRate);
            if (payableQuantity > this.available) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('钱包中没有足够的币挂单', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Not enough coin in wallet for listing', 'Ok');
                }
                return;
            }
            this.pinModal.show();
            return;
        } else {
            this.addListingDo();
        }
        */
       this.addListingDo();
    }

    addListingDo() {
        const data = {
            appId: appId,
            coin: this.coin,
            fiat: this.fiat,
            buy: this.buy,
            qtyAvilable: this.quantity,
            qtyLimitPerOrderLow: this.qtyLimitPerOrderLow,
            qtyLimitPerOrderHigh: this.qtyLimitPerOrderHigh,
            price: this.price,
            notes: this.notes,
            txid: this.txid
        };
        this._otcServ.addListing(this.token, data).subscribe(
            (res: any) => {
                console.log('res from addListing=', res);
                if (res.ok) {
                    this.listings.push(res._body);
                }
            }
        );
    }

    /*
        merchantId: ObjectId,
        sequence: Number,
        coin: String,
        fiat: String,
        buy: Boolean,
        qtyAvilable: Number,
        qtyLimitPerOrderLow: Number,
        qtyLimitPerOrderHigh: Number,
        price: Number,
        paymethods: [String],
    
        notes: String,
        active: Boolean,
        lastUpdated: Date,
    */

    changeAdvType(type: string) {
        this.advType = type;
    }

    changeCoin(bOrA: boolean, coin: string) {
        this.buy = bOrA;
        this.coin = coin;

        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            if (this.wallet.mycoins[i].name == this.coin) {
                this.currentCoin = this.wallet.mycoins[i];

                this.available = this.currentCoin.balance;

                const chainName = this.currentCoin.tokenType ? this.currentCoin.tokenType : this.currentCoin.name;
                this.gasPrice = environment.chains[chainName]['gasPrice'];
                this.gasLimit = environment.chains[chainName]['gasLimit'];
                this.satoshisPerBytes = environment.chains[chainName]['satoshisPerBytes'];
                break;
            }
        }
    }

    async onConfirmedPin(pin: string) {
        const pinHash = this.utilServ.SHA256(pin).toString();
        if (pinHash !== this.wallet.pwdHash) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('密码错误', 'Ok');
            } else {
                this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            }
            return;
        }

        const currentCoin = this.currentCoin;

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

        const amount = this.quantity * (1 + this.commissionRate);

        const doSubmit = true;
        const options = {
            gasPrice: this.gasPrice,
            gasLimit: this.gasLimit,
            satoshisPerBytes: this.satoshisPerBytes
        };

        const { txHex, txHash, errMsg } = await this.coinService.sendTransaction(currentCoin, seed,
            environment.addresses.otcOfficial[currentCoin.name], amount, options, doSubmit
        );

        if (errMsg) {
            this.alertServ.openSnackBar(errMsg, 'Ok');
            return;
        }
        if (txHex && txHash) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBarSuccess('交易成功提交', 'Ok');
            } else {
                this.alertServ.openSnackBarSuccess('your transaction was submitted successfully.', 'Ok');
            }

            const item: any = {
                walletId: this.wallet.id,
                type: 'Send',
                coin: currentCoin.name,
                tokenType: currentCoin.tokenType,
                amount: amount,
                txid: txHash,
                to: environment.addresses.otcOfficial[currentCoin.name],
                time: new Date(),
                confirmations: '0',
                blockhash: '',
                comment: '',
                status: 'pending'
            };
            this.timerServ.transactionStatus.next(item);
            this.timerServ.checkTransactionStatus(item);
            this.storageService.storeToTransactionHistoryList(item);
            console.log('amount2===', amount);
            console.log('this.quantity2===', this.quantity);
            this.txid = txHash;
            this.addListingDo();
            // this.addOrder(txHash, amount, this.quantity);
        }
    }
}
