import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendCoinForm } from '../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../models/wallet';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import { AlertService } from '../../../../services/alert.service';
import { UtilService } from '../../../../services/util.service';
import { ApiService } from '../../../../services/api.service';
import BigNumber from 'bignumber.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'send-coin-modal',
    templateUrl: './send-coin.modal.html',
    styleUrls: ['./send-coin.modal.css']
})
export class SendCoinModal {
    @Input() wallet: Wallet = {} as Wallet;
    @Input() alertMsg = '';
    coin: MyCoin = {} as MyCoin;
    gasUnit = '';
    transFee = 0;
    sendAllCoinsFlag = false;
    tranFeeUnit = '';
    @ViewChild('sendCoinModal', { static: true }) public sendCoinModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedCoinSent = new EventEmitter<SendCoinForm>();
    currentCoinIndex = 0;
    currentCoinBalance = 0;
    btcTransFeeEstimate: number;
    sendCoinForm = this.fb.group({
        sendTo: [''],
        sendAmount: [''],
        selectedCoinIndex: [0],
        comment: [''],
        gasFeeCustomChecked: [false],
        gasPrice: [environment.chains.FAB.gasPrice],
        gasLimit: [environment.chains.FAB.gasLimit],
        satoshisPerBytes: [environment.chains.FAB.satoshisPerBytes],
        feeLimit: [environment.chains.TRX.feeLimit]
    });

    constructor(
        private apiService: ApiService,
        private fb: FormBuilder,
        private utilServ: UtilService,
        private translateServ: TranslateService,
        private coinServ: CoinService,
        private alertServ: AlertService) {
        this.currentCoinIndex = 0;
        this.transFee = 0;
        this.sendAllCoinsFlag = false;
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

    async calCulateSendAllAmount() {
        if (this.wallet) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
        }
        const coinName = this.coin.name;
        const tokenType = this.coin.tokenType;
        const balance = this.coin.balance;
        const address = this.coin.receiveAdds[0].address;
        if (coinName === 'BTC' || coinName === 'LTC' || coinName === 'BCH' || coinName === 'DOGE') {
            const utxos = await this.apiService.getUtxos(coinName, address);
            if (!utxos) {
                return;
            }
            const utxoNum = utxos.length;
            const bytesPerInput = environment.chains[coinName].bytesPerInput;
            const satoshisPerBytes = this.sendCoinForm.value.satoshisPerBytes ? Number(this.sendCoinForm.value.satoshisPerBytes) : environment.chains[coinName].satoshisPerBytes;
            const transFee = (utxoNum * bytesPerInput + 2 * 34 + 10) * satoshisPerBytes;
            const transFeeDouble = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();
            let transOut = balance - transFeeDouble;
            if (transOut <= 0) {
                return;
            }
            transOut = Number(transOut.toFixed(8));
            this.sendCoinForm.patchValue({ 'sendAmount': transOut.toString() });
            this.onTextChange();
        } else if (coinName === 'FAB') {
            const utxos = await this.apiService.getFabUtxos(address);
            if (!utxos) {
                return;
            }
            const utxoNum = utxos.length;
            const bytesPerInput = environment.chains.FAB.bytesPerInput;
            const satoshisPerBytes = this.sendCoinForm.value.satoshisPerBytes ? Number(this.sendCoinForm.value.satoshisPerBytes) : environment.chains.FAB.satoshisPerBytes;
            const transFee = (utxoNum * bytesPerInput + 2 * 34 + 10) * satoshisPerBytes;
            const transFeeDouble = transFee / 1e8;
            let transOut = balance - transFeeDouble;
            if (transOut <= 0) {
                return;
            }
            transOut = Number(transOut.toFixed(8));
            this.sendCoinForm.patchValue({ sendAmount: transOut.toString() });
            this.onTextChange();
        } else if (['ETH','BNB','MATIC','HT'].indexOf(coinName)  >= 0) {
            const gasPrice = this.sendCoinForm.value.gasPrice ? Number(this.sendCoinForm.value.gasPrice) : environment.chains.ETH.gasPrice;
            const gasLimit = this.sendCoinForm.value.gasLimit ? Number(this.sendCoinForm.value.gasLimit) : environment.chains.ETH.gasLimit;
            const transFeeDouble = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).shiftedBy(-9).toNumber();
            let transOut = new BigNumber(balance).minus(new BigNumber(transFeeDouble)).toNumber();
            if (transOut <= 0) {
                return;
            }
            this.sendCoinForm.patchValue({ 'sendAmount': transOut.toString() });
            this.onTextChange();
        } else if (['ETH','BNB','MATIC','HT','FAB','TRX'].indexOf(tokenType) >= 0) {
            this.sendCoinForm.patchValue({ 'sendAmount': balance.toString() });
            this.onTextChange();
        } else if (coinName === 'TRX') {
            const transOut = balance;
            this.sendCoinForm.patchValue({ 'sendAmount': transOut.toString() });
            this.onTextChange();
        }
    }

    async sendAllAmount(event: any) {
        console.log('event=', event);

        /*
        if (this.wallet) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
            console.log('this.coin111==', this.coin);
        }       
        */
        this.sendAllCoinsFlag = event.checked;
        if (this.sendAllCoinsFlag) {
            await this.calCulateSendAllAmount();

            if(this.coin.name == 'TRX') {
                this.transFee = 0;
            }            
        } else {
            if(this.coin.name == 'TRX') {
                this.transFee = environment.chains.TRX.feeLimit;
            }            
        }
        
    }

    getTransFeeUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        const tokenType = this.coin.tokenType;
        const unit = tokenType ? tokenType : name;

        /*
        if (name === 'EXG' || (name === 'FAB' && !tokenType) || name === 'DUSD') {
            unit = 'FAB';
        } else if (name === 'ETH' || tokenType === 'ETH') {
            unit = 'ETH';
        } else if (name === 'BTC') {
            unit = 'BTC';
        } else {
            unit = 
        }
        */
        this.tranFeeUnit = unit;
        return unit;
    }

    getGasPriceUnit() {
        if (!this.coin) {
            return '';
        }
        const name = this.coin.name;
        const tokenType = this.coin.tokenType;
        let unit = '';
        if (name === 'EXG' || name === 'FAB' || name === 'DUSD') {
            unit = 'LIU';
        } else {
            unit = 'GWEI';
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
        let trxBalance = 0;

        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            const coin = this.wallet.mycoins[i];
            if(coin.receiveAdds[0].address != this.coin.receiveAdds[0].address) {
                continue;
            }
            if (coin.name === 'FAB' && !coin.tokenType) {
                fabBalance = coin.balance;
            } else if (coin.name === 'ETH') {
                ethBalance = coin.balance;
            } else if (coin.name === 'TRX') {
                trxBalance = coin.balance;
            }
        }
        const amount = Number(this.sendCoinForm.value.sendAmount);
        if ((this.coin.name === 'BTC') 
        || (this.coin.name === 'FAB' && !this.coin.coinType) 
        || (this.coin.name === 'ETH' && !this.coin.coinType) 
        || this.coin.name === 'TRX') {
            let transFee = this.transFee;
            if (new BigNumber(transFee).plus(new BigNumber(amount)).toNumber() > this.coin.balance) {
                console.log('o, no');
                this.alertServ.openSnackBar(
                    this.translateServ.instant('InsufficientForTransaction', {coin: this.coin.name}),
                    this.translateServ.instant('Ok'));                
                    return;
            }
        } else if (this.tranFeeUnit === 'FAB') {
            if (this.transFee > fabBalance) {
                this.alertServ.openSnackBar(
                    this.translateServ.instant('InsufficientForTransaction', {coin: this.tranFeeUnit}),
                    this.translateServ.instant('Ok'));
                return;
            }
        } else if (this.tranFeeUnit === 'ETH') {
            if (this.transFee > ethBalance) {
                this.alertServ.openSnackBar(
                    this.translateServ.instant('InsufficientForTransaction', {coin: this.tranFeeUnit}),
                    this.translateServ.instant('Ok'));
                return;
            }
        } else if (this.tranFeeUnit === 'TRX') {

            if (this.transFee > trxBalance) {
                this.alertServ.openSnackBar(
                    this.translateServ.instant('InsufficientForTransaction', {coin: this.tranFeeUnit}),
                    this.translateServ.instant('Ok'));
                return;
            }
        }

        let to: any = this.sendCoinForm.value.sendTo;
        if (this.coin.tokenType === 'FAB') {
            to = this.utilServ.fabToExgAddress(to);
        }

        if (!to) {
            this.alertServ.openSnackBar(
                this.translateServ.instant('Wallet address incorrect'),
                this.translateServ.instant('Ok'));
            return;
        }

        if((to.indexOf('0x') >= 0) && (to.length != 42)) {
            this.alertServ.openSnackBar(
                this.translateServ.instant('Wallet address incorrect'),
                this.translateServ.instant('Ok'));
            return;
        }

        if (this.coin.name === 'TRX' || this.coin.tokenType === 'TRX') {
            if (to.indexOf('T') !== 0) {

                this.alertServ.openSnackBar(
                    this.translateServ.instant('Wallet address incorrect'),
                    this.translateServ.instant('Ok'));
                return;
            }
        }
        const selectedCoinIndex = Number(this.sendCoinForm.value.selectedCoinIndex);

        const comment = this.sendCoinForm.value.comment;
        const gasPrice = this.sendCoinForm.value.gasPrice ? Number(this.sendCoinForm.value.gasPrice) : 0;
        const gasLimit = this.sendCoinForm.value.gasLimit ? Number(this.sendCoinForm.value.gasLimit) : 0;
        const feeLimit = this.sendCoinForm.value.feeLimit ? Number(this.sendCoinForm.value.feeLimit) : 0;
        const satoshisPerBytes = this.sendCoinForm.value.satoshisPerBytes ?
            Number(this.sendCoinForm.value.satoshisPerBytes) : 0;

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
        } else if ((this.coin.name === 'TRX') || (this.coin.tokenType === 'TRX')) {
            if (!feeLimit) {
                return;
            }
        }

        const theForm: any = {
            to: to,
            coinIndex: selectedCoinIndex,
            amount: amount,
            transFee: this.transFee,
            transFeeUnit: this.tranFeeUnit,
            comment: comment,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            feeLimit,
            satoshisPerBytes: satoshisPerBytes
        };
        this.confirmedCoinSent.emit(theForm);
        this.hide();
    }

    async onChange(event: any) {
        const index = (event.target as HTMLInputElement).value;
        this.coin = this.wallet.mycoins[Number(index)];
        this.currentCoinIndex = Number(index);
        console.log('this.coin===', this.coin);
        if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
            let gasPrice = await this.coinServ.getEthGasprice();
            if (!gasPrice) {
                gasPrice = environment.chains.ETH.gasPrice;
            }
            if (gasPrice > environment.chains.ETH.gasPriceMax) {
                gasPrice = environment.chains.ETH.gasPriceMax;
            }
            this.sendCoinForm.patchValue({'gasPrice': gasPrice});
            this.sendCoinForm.patchValue({'gasLimit': environment.chains.ETH.gasLimit});
            if (this.coin.tokenType === 'ETH') {
                this.sendCoinForm.patchValue({'gasLimit': environment.chains.ETH.gasLimitToken});
            }
        } else if (
            (['BNB', 'MATIC', 'HT'].indexOf(this.coin.name) >= 0) 
            || (['BNB', 'MATIC', 'HT'].indexOf(this.coin.tokenType) >= 0)
            ) {
                const chainName = this.coin.tokenType ? this.coin.tokenType : this.coin.name;
            let gasPrice = await this.coinServ.getEtheruemCompatibleGasprice(chainName);
            console.log('gasPrice for getEtheruemCompatibleGasprice=', gasPrice);
            if (!gasPrice) {
                gasPrice = environment.chains[chainName].gasPrice;
            }
            if (gasPrice > environment.chains[chainName].gasPriceMax) {
                gasPrice = environment.chains[chainName].gasPriceMax;
            }
            this.sendCoinForm.patchValue({'gasPrice': gasPrice});
            this.sendCoinForm.patchValue({'gasLimit': environment.chains[chainName].gasLimit});
            if (['BNB','MATIC','HT'].indexOf(this.coin.tokenType) >= 0) {
                this.sendCoinForm.patchValue({'gasLimit': environment.chains[chainName].gasLimitToken});
            }
        } 
        else if (this.coin.name === 'FAB') {
            this.sendCoinForm.patchValue({'satoshisPerBytes': environment.chains.FAB.satoshisPerBytes});
        } else if (this.coin.name === 'DOGE') {
            this.sendCoinForm.patchValue({'satoshisPerBytes': environment.chains.DOGE.satoshisPerBytes});
        } else if (this.coin.name === 'BTC') {
            let defaultSatoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
            if (this.btcTransFeeEstimate) {
                defaultSatoshisPerBytes = this.btcTransFeeEstimate;
            }
            this.sendCoinForm.patchValue({'satoshisPerBytes': defaultSatoshisPerBytes});
        } else if (this.coin.tokenType === 'FAB') {
            this.sendCoinForm.patchValue({'satoshisPerBytes': environment.chains.FAB.satoshisPerBytes});
            this.sendCoinForm.patchValue({'gasPrice': environment.chains.FAB.gasPrice});
            this.sendCoinForm.patchValue({'gasLimit': environment.chains.FAB.gasLimit});
        }
        this.checkTransFee();
        if (this.sendAllCoinsFlag) {
            this.calCulateSendAllAmount();
        }
    }

    onTextChange() {
        this.checkTransFee();
    }
    async checkTransFee() {

        if (!this.coin) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
        }
        let to = this.sendCoinForm.value.sendTo;
        if (!to) {
            to = environment.addresses.exchangilyOfficial[this.coin.name];
        } else if (this.coin.tokenType === 'FAB') {
            // if(to.indexOf('0x') < 0) {
            to = this.utilServ.fabToExgAddress(to);
            // }
        }

        const amount = Number(this.sendCoinForm.value.sendAmount);
        const gasPrice = this.sendCoinForm.value.gasPrice ? Number(this.sendCoinForm.value.gasPrice) : 0;
        const gasLimit = this.sendCoinForm.value.gasLimit ? Number(this.sendCoinForm.value.gasLimit) : 0;
        const feeLimit = this.sendCoinForm.value.feeLimit ? Number(this.sendCoinForm.value.feeLimit) : 0;
        const satoshisPerBytes = this.sendCoinForm.value.satoshisPerBytes ?
            Number(this.sendCoinForm.value.satoshisPerBytes) : 0;

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
        } else 
        if((this.coin.name === 'TRX') || (this.coin.tokenType === 'TRX')) {
            if(!feeLimit) {
                return;
            }
        }

        if((this.coin.name === 'TRX') || (this.coin.tokenType === 'TRX')) {
            this.transFee = feeLimit; 
        }
        else {
            const options = {
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                satoshisPerBytes: satoshisPerBytes,
                getTransFeeOnly: true
            };
    
            const ret = await this.coinServ.sendTransaction(this.coin, Buffer.from(''), to, amount, options, false);
    
            console.log('ret===', ret);
            this.transFee = ret.transFee;
        }

        
    }

    show() {
        this.sendCoinModal.show();
    }

    hide() {
        this.sendCoinModal.hide();
    }

}
