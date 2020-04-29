import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { AlertService } from '../../../../services/alert.service';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'deposit-amount-modal',
    templateUrl: './deposit-amount.modal.html',
    styleUrls: ['./deposit-amount.modal.css']
})
export class DepositAmountModal {
    @ViewChild('depositModal', { static: true }) public depositModal: ModalDirective;
    @Input() coin: MyCoin;
    @Input() alertMsg: string;
    @Output() confirmedAmount = new EventEmitter<any>();
    transFee: number;
    firstTime: boolean;
    tranFeeUnit: string;
    kanbanTransFee: number;
    depositAmountForm = this.fb.group({
        depositAmount: [''],
        gasFeeCustomChecked: [false],
        gasPrice: [environment.chains.FAB.gasPrice],
        gasLimit: [environment.chains.FAB.gasLimit],
        satoshisPerBytes: [environment.chains.FAB.satoshisPerBytes],
        kanbanGasPrice: [environment.chains.KANBAN.gasPrice],
        kanbanGasLimit: [environment.chains.KANBAN.gasLimit]
    });

    constructor(private fb: FormBuilder, private alertServ: AlertService, private coinServ: CoinService) {
        this.transFee = 0;
        this.kanbanTransFee = 0;
        this.firstTime = true;


    }

    getTransFeeUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        let unit = '';
        if (name === 'EXG' || name === 'FAB' || name === 'DUSD') {
            unit = 'FAB';
        } else
            if (name === 'ETH' || name === 'USDT') {
                unit = 'ETH';
            } else
                if (name === 'BTC') {
                    unit = 'BTC';
                }
        this.tranFeeUnit = unit;
        return unit;
    }

    onTextChange(val) {
        if (this.firstTime && this.coin) {
            if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
                this.depositAmountForm.get('gasPrice').setValue(environment.chains.ETH.gasPrice);
                this.depositAmountForm.get('gasLimit').setValue(environment.chains.ETH.gasLimit);
            } else
                if (this.coin.name === 'FAB') {
                    this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
                } else
                    if (this.coin.name === 'BTC') {
                        this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.BTC.satoshisPerBytes);
                    } else
                        if (this.coin.tokenType === 'FAB') {
                            this.depositAmountForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
                            this.depositAmountForm.get('gasPrice').setValue(environment.chains.FAB.gasPrice);
                            this.depositAmountForm.get('gasLimit').setValue(environment.chains.FAB.gasLimit);
                        }
            this.firstTime = false;
        }
        this.checkTransFee();
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

        console.log('this.coin=', this.coin);
        console.log('amount=', amount);
        console.log('options=', options);
        const ret = await this.coinServ.sendTransaction(this.coin, null, to, amount, options, false);
        console.log('ret=', ret);
        this.transFee = ret.transFee;


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
            this.alertServ.openSnackBar('Please provide the right amount for deposit.', 'Ok');
            return;
        }
        if (amount > this.coin.balance) {
            this.alertServ.openSnackBar('No enough balance for deposit.', 'Ok');
            return;
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
        this.depositModal.show();
    }
    hide() {
        this.depositModal.hide();
    }
}
