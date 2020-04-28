import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendCoinForm } from '../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../models/wallet';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import { ApiService } from '../../../../services/api.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
    selector: 'send-coin-modal',
    templateUrl: './send-coin.modal.html',
    styleUrls: ['./send-coin.modal.css']
})
export class SendCoinModal {
    @Input() wallet: Wallet;
    @Input() alertMsg: string;
    coin: MyCoin;
    gasUnit: string;
    transFee: number;
    tranFeeUnit: string;
    @ViewChild('sendCoinModal', { static: true }) public sendCoinModal: ModalDirective;
    @Output() confirmedCoinSent = new EventEmitter<SendCoinForm>();
    currentCoinIndex: number;
    currentCoinBalance: number;
    btcTransFeeEstimate: number;
    sendCoinForm = this.fb.group({
        sendTo: [''],
        sendAmount: [''],
        selectedCoinIndex: [0],
        comment: [''],
        gasFeeCustomChecked: [false],
        gasPrice: [environment.chains.FAB.gasPrice],
        gasLimit: [environment.chains.FAB.gasLimit],
        satoshisPerBytes: [environment.chains.FAB.satoshisPerBytes]
    });
    constructor(private fb: FormBuilder,
        private coinServ: CoinService, private alertServ: AlertService) {
        this.currentCoinIndex = 0;
        this.transFee = 0;
        this.btcTransFeeEstimate = 0;
        /*
        this.apiServ.getBtcTransFeeEstimate().subscribe(
            (res: any) => {
                if (res && res.feerate) {
                    this.btcTransFeeEstimate = res.feerate * 100000;
                    console.log('this.btcTransFeeEstimate =' + this.btcTransFeeEstimate );
                }
            }
        );
        */
        if (this.wallet) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
            console.log('this.coin111==', this.coin);
        }
    }
    getTransFeeUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        let unit = '';
        if (name === 'EXG' || name === 'FAB' || name === 'DUSD') {
            unit = 'FAB';
        } else if (name === 'ETH' || name === 'USDT') {
            unit = 'ETH';
        } else if (name === 'BTC') {
            unit = 'BTC';
        }
        this.tranFeeUnit = unit;
        return unit;
    }

    getGasPriceUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        let unit = '';
        if (name === 'EXG' || name === 'FAB' || name === 'DUSD') {
            unit = 'LIU';
        } else
            if (name === 'ETH' || name === 'USDT') {
                unit = 'WEI';
            }
        this.gasUnit = unit;
        return unit;
    }

    onSubmit() {
        if (!this.coin) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
        }

        let fabBalance = 0;
        let ethBalance = 0;
        let btcBalance = 0;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            if (this.wallet.mycoins[i].name === 'FAB') {
                fabBalance = this.wallet.mycoins[i].receiveAdds[0].balance;
            } else if (this.wallet.mycoins[i].name === 'ETH') {
                ethBalance = this.wallet.mycoins[i].receiveAdds[0].balance;
            } else if (this.wallet.mycoins[i].name === 'BTC') {
                btcBalance = this.wallet.mycoins[i].receiveAdds[0].balance;
            }
        }

        if (this.tranFeeUnit === 'BTC') {
            if (this.transFee > btcBalance) {
                this.alertServ.openSnackBar('Insufficient BTC for this transaction', 'Ok');
                return;
            }
        } else if (this.tranFeeUnit === 'FAB') {
            if (this.transFee > fabBalance) {
                this.alertServ.openSnackBar('Insufficient FAB for this transaction', 'Ok');
                return;
            }
        } else if (this.tranFeeUnit === 'ETH') {
            if (this.transFee > ethBalance) {
                this.alertServ.openSnackBar('Insufficient ETH for this transaction', 'Ok');
                return;
            }
        }

        const to = this.sendCoinForm.get('sendTo').value;
        const selectedCoinIndex = Number(this.sendCoinForm.get('selectedCoinIndex').value);
        const amount = Number(this.sendCoinForm.get('sendAmount').value);
        if (amount > this.coin.receiveAdds[0].balance) {
            this.alertServ.openSnackBar('Insufficient ' + this.coin.name + ' for this transaction', 'Ok');
            return;
        }
        const comment = this.sendCoinForm.get('comment').value;
        const gasPrice = this.sendCoinForm.get('gasPrice').value ? Number(this.sendCoinForm.get('gasPrice').value) : 0;
        const gasLimit = this.sendCoinForm.get('gasLimit').value ? Number(this.sendCoinForm.get('gasLimit').value) : 0;
        const satoshisPerBytes = this.sendCoinForm.get('satoshisPerBytes').value ?
            Number(this.sendCoinForm.get('satoshisPerBytes').value) : 0;

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

        const theForm = {
            to: to,
            coinIndex: selectedCoinIndex,
            amount: amount,
            comment: comment,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            satoshisPerBytes: satoshisPerBytes
        };
        this.confirmedCoinSent.emit(theForm);
        this.hide();
    }

    async onChange(index: number) {
        this.coin = this.wallet.mycoins[index];
        if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
            this.sendCoinForm.get('gasPrice').setValue(environment.chains.ETH.gasPrice);
            this.sendCoinForm.get('gasLimit').setValue(environment.chains.ETH.gasLimit);
        } else if (this.coin.name === 'FAB') {
            this.sendCoinForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
        } else if (this.coin.name === 'BTC') {
            let defaultSatoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
            if (this.btcTransFeeEstimate) {
                defaultSatoshisPerBytes = this.btcTransFeeEstimate;
            }
            this.sendCoinForm.get('satoshisPerBytes').setValue(defaultSatoshisPerBytes);
        } else if (this.coin.tokenType === 'FAB') {
            this.sendCoinForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
            this.sendCoinForm.get('gasPrice').setValue(environment.chains.FAB.gasPrice);
            this.sendCoinForm.get('gasLimit').setValue(environment.chains.FAB.gasLimit);
        }
        this.checkTransFee();
    }

    onTextChange(val) {
        this.checkTransFee();
    }
    async checkTransFee() {

        if (!this.coin) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
        }
        const to = this.sendCoinForm.get('sendTo').value;
        const selectedCoinIndex = Number(this.sendCoinForm.get('selectedCoinIndex').value);
        const amount = Number(this.sendCoinForm.get('sendAmount').value);
        const comment = this.sendCoinForm.get('comment').value;
        const gasPrice = this.sendCoinForm.get('gasPrice').value ? Number(this.sendCoinForm.get('gasPrice').value) : 0;
        const gasLimit = this.sendCoinForm.get('gasLimit').value ? Number(this.sendCoinForm.get('gasLimit').value) : 0;
        const satoshisPerBytes = this.sendCoinForm.get('satoshisPerBytes').value ?
            Number(this.sendCoinForm.get('satoshisPerBytes').value) : 0;

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
        return ret;
    }

    show() {
        this.sendCoinModal.show();
    }

    hide() {
        this.sendCoinModal.hide();
    }

}
