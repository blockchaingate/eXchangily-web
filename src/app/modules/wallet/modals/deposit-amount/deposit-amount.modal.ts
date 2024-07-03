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
    confirmations: number;
    lan = 'en';
    depositAmountForm = this.fb.group({
        depositAmount: [''],
        gasFeeCustomChecked: [false],
        gasPrice: [environment.chains.FAB.gasPrice],
        gasLimit: [environment.chains.FAB.gasLimit],
        satoshisPerBytes: [environment.chains.FAB.satoshisPerBytes],
        feeLimit: [environment.chains.TRX.feeLimit]
    });

    constructor(
        private tranServ: TranslateService, private apiService: ApiService,
        private fb: FormBuilder, private alertServ: AlertService, private coinServ: CoinService
    ) {
        this.transFee = 0;
        this.firstTime = true;
        this.disabled = false;
        this.sendAllCoinsFlag = false;
    }

    async sendAllAmount(event) {
        console.log('event=', event);
        this.sendAllCoinsFlag = event.checked;
        console.log('this.sendAllCoinsFlag==', this.sendAllCoinsFlag);
        
        const coinName = this.coin.name;
        const tokenType = this.coin.tokenType;
        const balance = this.coin.balance;
        const address = this.coin.receiveAdds[0].address;

        if (this.sendAllCoinsFlag) {
            if(this.coin.name == 'TRX') {
                this.transFee = 0;
            }            
        } else {
            if(this.coin.name == 'TRX') {
                this.transFee = environment.chains.TRX.feeLimit;
            }            
        }
        
        if (coinName === 'BTC') {
            const utxos = await this.apiService.getBtcUtxos(address);
            if (!utxos) {
                return;
            }
            const utxoNum = utxos.length;
            const bytesPerInput = environment.chains.BTC.bytesPerInput;
            // const satoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
            const satoshisPerBytes = this.depositAmountForm.value.satoshisPerBytes ? Number(this.depositAmountForm.value.satoshisPerBytes) : environment.chains.BTC.satoshisPerBytes;
            const transFee = (utxoNum * bytesPerInput + 2 * 34 + 10) * satoshisPerBytes;
            const transFeeDouble = transFee / 1e8;
            let transOut = balance - transFeeDouble;
            if (transOut <= 0) {
                return;
            }
            transOut = Number(transOut.toFixed(8));
            this.depositAmountForm.patchValue({ 'depositAmount': transOut.toString() });
            this.onTextChange();
        } else
            if (coinName === 'FAB') {
                const utxos = await this.apiService.getFabUtxos(address);
                if (!utxos) {
                    return;
                }
                const utxoNum = utxos.length;
                const bytesPerInput = environment.chains.FAB.bytesPerInput;
                // const satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                const satoshisPerBytes = this.depositAmountForm.value.satoshisPerBytes ? Number(this.depositAmountForm.value.satoshisPerBytes) : environment.chains.FAB.satoshisPerBytes;
                const transFee = (utxoNum * bytesPerInput + 2 * 34 + 10) * satoshisPerBytes;
                const transFeeDouble = transFee / 1e8;
                let transOut = balance - transFeeDouble;
                if (transOut <= 0) {
                    return;
                }
                transOut = Number(transOut.toFixed(8));
                this.depositAmountForm.patchValue({ 'depositAmount': transOut.toString() });
                this.onTextChange();
            } else
                if (coinName === 'ETH') {
                    // const gasPrice = environment.chains.ETH.gasPrice;
                    // const gasLimit = environment.chains.ETH.gasLimit;
                    const gasPrice = this.depositAmountForm.value.gasPrice ? Number(this.depositAmountForm.value.gasPrice) : environment.chains.ETH.gasPrice;
                    const gasLimit = this.depositAmountForm.value.gasLimit ? Number(this.depositAmountForm.value.gasLimit) : environment.chains.ETH.gasLimit;
                    const transFeeDouble = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).shiftedBy(-9).toNumber();
                    let transOut = new BigNumber(balance).minus(new BigNumber(transFeeDouble)).toNumber();
                    if (transOut <= 0) {
                        return;
                    }
                    this.depositAmountForm.patchValue({ 'depositAmount': transOut.toString() });
                    this.onTextChange();
                } else
                    if (tokenType === 'FAB' || tokenType === 'ETH') {
                        this.depositAmountForm.patchValue({ 'depositAmount': balance.toString() });
                        this.onTextChange();
                    }
    }
    getTransFeeUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        const tokenType = this.coin.tokenType;
        let unit = '';
        if (name === 'EXG' || (name === 'FAB' && !tokenType) || name === 'DUSD') {
            unit = 'FAB';
        } else if (name === 'ETH' || tokenType === 'ETH') {
            unit = 'ETH';
        } else if (name === 'TRX' || tokenType === 'TRX') {
            unit = 'TRX';
        } else if (name === 'TRX' || tokenType === 'TRX') {
            unit = 'TRX';
        } else if (name === 'BTC') {
            unit = 'BTC';
        } else {
            unit = tokenType;
        }
        this.tranFeeUnit = unit;
        return unit;
    }

    async onTextChange() {
        this.transFee = 0;
        if (this.firstTime && this.coin) {
            if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
                let gasPrice = await this.coinServ.getEthGasprice();
                if (!gasPrice) {
                    gasPrice = environment.chains.ETH.gasPrice;
                }
                if (gasPrice > environment.chains.ETH.gasPriceMax) {
                    gasPrice = environment.chains.ETH.gasPriceMax;
                }
                this.depositAmountForm.patchValue({'gasPrice':gasPrice});
                this.depositAmountForm.patchValue({'gasLimit':environment.chains.ETH.gasLimit});
                if (this.coin.tokenType === 'ETH') {
                    this.depositAmountForm.patchValue({'gasLimit': environment.chains.ETH.gasLimitToken});
                }
            } else 
            if((this.coin.name === 'BNB') || (this.coin.tokenType === 'BNB')
            || (this.coin.name === 'MATIC') || (this.coin.tokenType === 'MATIC')) {
                const chainName = this.coin.tokenType ? this.coin.tokenType : this.coin.name;
                let gasPrice = await this.coinServ.getEtheruemCompatibleGasprice(chainName);
                if (!gasPrice) {
                    gasPrice = environment.chains[chainName].gasPrice;
                }
                if (gasPrice > environment.chains[chainName].gasPriceMax) {
                    gasPrice = environment.chains[chainName].gasPriceMax;
                }
                this.depositAmountForm.patchValue({'gasPrice':gasPrice});
                this.depositAmountForm.patchValue({'gasLimit':environment.chains[chainName].gasLimit});
                if (this.coin.tokenType === 'BNB' || this.coin.tokenType === 'MATIC') {
                    this.depositAmountForm.patchValue({'gasLimit': environment.chains[chainName].gasLimitToken});
                }                
            }
            else if (this.coin.name === 'FAB') {
                this.depositAmountForm.patchValue({'satoshisPerBytes':environment.chains.FAB.satoshisPerBytes});
            } else if (this.coin.name === 'BCH') {
                this.depositAmountForm.patchValue({'satoshisPerBytes': environment.chains.BCH.satoshisPerBytes});
            } else if (this.coin.name === 'LTC') {
                this.depositAmountForm.patchValue({'satoshisPerBytes': environment.chains.LTC.satoshisPerBytes});
            } else if (this.coin.name === 'DOGE') {
                this.depositAmountForm.patchValue({'satoshisPerBytes': environment.chains.DOGE.satoshisPerBytes});
            } else if (this.coin.name === 'BTC') {
                this.depositAmountForm.patchValue({'satoshisPerBytes': environment.chains.BTC.satoshisPerBytes});
            } else if (this.coin.tokenType === 'FAB') {
                this.depositAmountForm.patchValue({'satoshisPerBytes': environment.chains.FAB.satoshisPerBytes});
                this.depositAmountForm.patchValue({'gasPrice': environment.chains.FAB.gasPrice});
                this.depositAmountForm.patchValue({'gasLimit': environment.chains.FAB.gasLimit});
            } else if (this.coin.tokenType === 'TRX' || this.coin.name == 'TRX') {
                this.depositAmountForm.patchValue({'feeLimit': environment.chains.TRX.feeLimit});
            }
            this.firstTime = false;
        }
        this.checkTransFee();

    }

    initForm(coin) {
        this.lan = this.tranServ.currentLang;
        this.firstTime = true;
        this.coin = coin;
        this.onTextChange();
    }

    async checkTransFee() {
        const to = await this.coinServ.getOfficialAddress(this.coin);
        const amount = Number(this.depositAmountForm.value.depositAmount);
        const gasPrice = this.depositAmountForm.value.gasPrice ? Number(this.depositAmountForm.value.gasPrice) : 0;
        const gasLimit = this.depositAmountForm.value.gasLimit ? Number(this.depositAmountForm.value.gasLimit) : 0;
        const feeLimit = this.depositAmountForm.value.feeLimit ? Number(this.depositAmountForm.value.feeLimit) : 0;
        const satoshisPerBytes = this.depositAmountForm.value.satoshisPerBytes ?
            Number(this.depositAmountForm.value.satoshisPerBytes) : 0;

        if (!to) {
            return;
        }
        if (!amount) {
            return;
        }
        if ((this.coin.name === 'TRX') || (this.coin.tokenType === 'TRX')) {
            if (!feeLimit) {
                return;
            }
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
            feeLimit,
            getTransFeeOnly: true
        };

        // console.log('this.coin=', this.coin);
        // console.log('amount=', amount);


        const ret = await this.coinServ.sendTransaction(this.coin, Buffer.from(''), to, amount, options, false);

        this.transFee = ret.transFee;
        this.getTransFeeUnit();


        return ret;
    }

    async onSubmit() {
        const gasPrice = this.depositAmountForm.value.gasPrice ? Number(this.depositAmountForm.value.gasPrice) : 0;
        const gasLimit = this.depositAmountForm.value.gasLimit ? Number(this.depositAmountForm.value.gasLimit) : 0;
        const feeLimit = this.depositAmountForm.value.feeLimit ? Number(this.depositAmountForm.value.feeLimit) : 0;
        const satoshisPerBytes = this.depositAmountForm.value.satoshisPerBytes ?
            Number(this.depositAmountForm.value.satoshisPerBytes) : 0;


        const depositAmount = this.depositAmountForm.value.depositAmount;
        const amount = Number(depositAmount);
        
        if ((amount <= 0) || Number.isNaN(amount)) {
            this.alertServ.openSnackBar(
                this.tranServ.instant('Please enter valid deposit amount.'), 
                this.tranServ.instant('Ok'));
            return;
        }
        
        if (environment.production && (amount > this.coin.balance)) {
            this.alertServ.openSnackBar(
                this.tranServ.instant('No enough balance for deposit.'), 
                this.tranServ.instant('Ok'));
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
            feeLimit
        };

        this.confirmedAmount.emit(data);
        this.hide();
    }

    show() {
        this.confirmations = 12;
        this.depositModal.show();
    }

    hide() {
        this.depositModal.hide();
    }
}
