import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { AlertService } from '../../../../services/alert.service';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import BigNumber from 'bignumber.js';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../../services/api.service';

@Component({
    selector: 'deposit-amount-modal',
    templateUrl: './deposit-amount.modal.html',
    styleUrls: ['./deposit-amount.modal.css']
})
export class DepositAmountModal {
    @ViewChild('depositModal', { static: true }) public depositModal: ModalDirective;
    @Input() coin: MyCoin;
    @Input() baseCoinBalance: number;
    @Input() alertMsg: string;
    @Output() confirmedAmount = new EventEmitter<any>();
    transFee: number;
    firstTime: boolean;
    sendAllCoinsFlag: boolean;
    tranFeeUnit: string;
    disabled: boolean;
    kanbanTransFee: number;
    confirmations: number;
    lan = 'en';
    depositAmountForm = this.fb.group({
        depositAmount: [''],
        gasFeeCustomChecked: [false],
        gasPrice: [environment.chains.FAB.gasPrice],
        gasLimit: [environment.chains.FAB.gasLimit],
        satoshisPerBytes: [environment.chains.FAB.satoshisPerBytes],
        kanbanGasPrice: [environment.chains.KANBAN.gasPrice],
        kanbanGasLimit: [environment.chains.KANBAN.gasLimit]
    });

    constructor(
        private tranServ: TranslateService, private apiService: ApiService,
        private fb: FormBuilder, private alertServ: AlertService, private coinServ: CoinService
    ) {
        this.transFee = 0;
        this.kanbanTransFee = 0;
        this.firstTime = true;
        this.disabled = false;
        this.sendAllCoinsFlag = false;
        console.log('this.lan===', this.lan);
    }

    async sendAllAmount(event) {
        console.log('event=', event);
        this.sendAllCoinsFlag = event.checked;
        console.log('this.sendAllCoinsFlag==', this.sendAllCoinsFlag);
        const coinName = this.coin.name;
        const tokenType = this.coin.tokenType;
        const balance = this.coin.balance;
        const address = this.coin.receiveAdds[0].address;
        if (coinName === 'BTC') {
            const utxos = await this.apiService.getBtcUtxos(address);
            if (!utxos) {
                return;
            }
            const utxoNum = utxos.length;
            const bytesPerInput = environment.chains.BTC.bytesPerInput;
            // const satoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
            const satoshisPerBytes = this.depositAmountForm.get('satoshisPerBytes').value ? Number(this.depositAmountForm.get('satoshisPerBytes').value) : environment.chains.BTC.satoshisPerBytes;
            const transFee = (utxoNum * bytesPerInput + 2 * 34 + 10) * satoshisPerBytes;
            const transFeeDouble = transFee / 1e8;
            let transOut = balance - transFeeDouble;
            if (transOut <= 0) {
                return;
            }
            transOut = Number(transOut.toFixed(8));
            this.depositAmountForm.patchValue({ 'depositAmount': transOut });
            this.onTextChange(transOut);
        } else
            if (coinName === 'FAB') {
                const utxos = await this.apiService.getFabUtxos(address);
                if (!utxos) {
                    return;
                }
                const utxoNum = utxos.length;
                const bytesPerInput = environment.chains.FAB.bytesPerInput;
                // const satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                const satoshisPerBytes = this.depositAmountForm.get('satoshisPerBytes').value ? Number(this.depositAmountForm.get('satoshisPerBytes').value) : environment.chains.FAB.satoshisPerBytes;
                const transFee = (utxoNum * bytesPerInput + 2 * 34 + 10) * satoshisPerBytes;
                const transFeeDouble = transFee / 1e8;
                let transOut = balance - transFeeDouble;
                if (transOut <= 0) {
                    return;
                }
                transOut = Number(transOut.toFixed(8));
                this.depositAmountForm.patchValue({ 'depositAmount': transOut });
                this.onTextChange(transOut);
            } else
                if (coinName === 'ETH') {
                    // const gasPrice = environment.chains.ETH.gasPrice;
                    // const gasLimit = environment.chains.ETH.gasLimit;
                    const gasPrice = this.depositAmountForm.get('gasPrice').value ? Number(this.depositAmountForm.get('gasPrice').value) : environment.chains.ETH.gasPrice;
                    const gasLimit = this.depositAmountForm.get('gasLimit').value ? Number(this.depositAmountForm.get('gasLimit').value) : environment.chains.ETH.gasLimit;
                    const transFeeDouble = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toNumber();
                    let transOut = balance - transFeeDouble;
                    if (transOut <= 0) {
                        return;
                    }
                    transOut = Number(transOut.toFixed(8));
                    this.depositAmountForm.patchValue({ 'depositAmount': transOut });
                    this.onTextChange(transOut);
                } else
                    if (tokenType === 'FAB' || tokenType === 'ETH') {
                        this.depositAmountForm.patchValue({ 'depositAmount': balance });
                        this.onTextChange(balance);
                    }
    }
    getTransFeeUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        const tokenType = this.coin.tokenType;
        let unit = tokenType ? tokenType: name;
        this.tranFeeUnit = unit;
        return unit;
    }

    async onTextChange(val) {
        if (this.firstTime && this.coin) {
            if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
                let gasPrice = await this.coinServ.getEthGasprice();
                if (!gasPrice || (gasPrice < environment.chains.ETH.gasPrice)) {
                    gasPrice = environment.chains.ETH.gasPrice;
                }
                if (gasPrice > environment.chains.ETH.gasPriceMax) {
                    gasPrice = environment.chains.ETH.gasPriceMax;
                }
                this.depositAmountForm.get('gasPrice').setValue(gasPrice);
                this.depositAmountForm.get('gasLimit').setValue(environment.chains.ETH.gasLimit);
                if (this.coin.tokenType === 'ETH') {
                    this.depositAmountForm.get('gasLimit').setValue(environment.chains.ETH.gasLimitToken);
                }
            } else if (this.coin.name === 'FAB') {
                this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
            } else if (this.coin.name === 'BCH') {
                this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.BCH.satoshisPerBytes);
            } else if (this.coin.name === 'LTC') {
                this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.LTC.satoshisPerBytes);
            } else if (this.coin.name === 'DOGE') {
                this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.DOGE.satoshisPerBytes);
            } else if (this.coin.name === 'BTC') {
                this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.BTC.satoshisPerBytes);
            } else if (this.coin.tokenType === 'FAB') {
                this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
                this.depositAmountForm.get('gasPrice').setValue(environment.chains.FAB.gasPrice);
                this.depositAmountForm.get('gasLimit').setValue(environment.chains.FAB.gasLimit);
            }
            this.firstTime = false;
        }
        this.checkTransFee();

    }

    initForm(coin) {
        this.lan = this.tranServ.currentLang;
        this.firstTime = true;
        this.coin = coin;
        this.onTextChange(null);
    }

    async checkTransFee() {
        const to = this.coinServ.getOfficialAddress(this.coin);
        const amount = Number(this.depositAmountForm.get('depositAmount').value);
        const gasPrice = this.depositAmountForm.get('gasPrice').value ? Number(this.depositAmountForm.get('gasPrice').value) : 0;
        const gasLimit = this.depositAmountForm.get('gasLimit').value ? Number(this.depositAmountForm.get('gasLimit').value) : 0;
        const satoshisPerBytes = this.depositAmountForm.get('satoshisPerBytes').value ?
            Number(this.depositAmountForm.get('satoshisPerBytes').value) : 0;

        if (!to) {
            return;
        }
        if (!amount) {
            return;
        }

        if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
            if (!gasPrice || !gasLimit) {
                return;
            }
        } else if ((this.coin.name === 'FAB') || (this.coin.name === 'BTC')) {
            if (!satoshisPerBytes) {
                return;
            }
        } else if (this.coin.tokenType === 'FAB') {
            if (!gasPrice || !gasLimit || !satoshisPerBytes) {
                return;
            }
        }

        const options = {
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            satoshisPerBytes: satoshisPerBytes,
            getTransFeeOnly: true
        };

        // console.log('this.coin=', this.coin);
        // console.log('amount=', amount);
        // console.log('options=', options);
        const ret = await this.coinServ.sendTransaction(this.coin, null, to, amount, options, false);
        // console.log('ret=', ret);
        this.transFee = ret.transFee;
        this.getTransFeeUnit();

        const kanbanGasPrice = Number(this.depositAmountForm.get('kanbanGasPrice').value);
        const kanbanGasLimit = Number(this.depositAmountForm.get('kanbanGasLimit').value);
        this.kanbanTransFee = new BigNumber(kanbanGasPrice).multipliedBy(new BigNumber(kanbanGasLimit))
            .dividedBy(new BigNumber(1e18)).toNumber();

        return ret;
    }

    onSubmit() {
        const gasPrice = this.depositAmountForm.get('gasPrice').value ? Number(this.depositAmountForm.get('gasPrice').value) : 0;
        const gasLimit = this.depositAmountForm.get('gasLimit').value ? Number(this.depositAmountForm.get('gasLimit').value) : 0;
        const satoshisPerBytes = this.depositAmountForm.get('satoshisPerBytes').value ?
            Number(this.depositAmountForm.get('satoshisPerBytes').value) : 0;
        const kanbanGasPrice = this.depositAmountForm.get('kanbanGasPrice').value ?
            Number(this.depositAmountForm.get('kanbanGasPrice').value) : 0;
        const kanbanGasLimit = this.depositAmountForm.get('kanbanGasLimit').value ?
            Number(this.depositAmountForm.get('kanbanGasLimit').value) : 0;

        const depositAmount = this.depositAmountForm.get('depositAmount').value;
        const amount = Number(depositAmount);
        // console.log('amount=', amount);
        if ((amount <= 0) || Number.isNaN(amount)) {
            this.alertServ.openSnackBar('Please enter valid deposit amount.', 'Ok');
            return;
        }
        if (amount > this.coin.balance) {
            this.alertServ.openSnackBar('No enough balance for deposit.', 'Ok');
            return;
        }

        const coinName = this.coin.name;
        const tokenType = this.coin.tokenType;
        if (
            (coinName === 'BTC')
            || (coinName === 'ETH')
            || (coinName === 'FAB')
            || (coinName === 'DOGE')
            || (coinName === 'BCH')
            || (coinName === 'LTC')
        ) {
            if (this.coin.balance < (this.transFee + amount)) {
                this.alertServ.openSnackBar('No enough balance for deposit.', 'Ok');
                return;
            }
        } else
            if (
                (tokenType === 'ETH')
                || (tokenType === 'FAB')
            ) {
                if (this.coin.balance < (this.transFee)) {
                    this.alertServ.openSnackBar('No enough balance' + tokenType + ' for deposit.', 'Ok');
                    return;
                }
            }

        this.depositAmountForm.patchValue(
            { depositAmount: '' }
        );

        const data = {
            amount: amount,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            transFee: this.transFee,
            tranFeeUnit: this.tranFeeUnit,
            satoshisPerBytes: satoshisPerBytes,
            kanbanGasPrice: kanbanGasPrice,
            kanbanGasLimit: kanbanGasLimit
        };

        this.confirmedAmount.emit(data);
        this.hide();
    }

    show() {
        this.confirmations = environment.depositMinimumConfirmations[this.coin.name];
        this.depositModal.show();
    }

    hide() {
        this.depositModal.hide();
    }
}
