import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import {SendCoinForm} from '../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../models/wallet';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';


@Component({
    selector: 'send-coin-modal',
    templateUrl: './send-coin.modal.html',
    styleUrls: ['./send-coin.modal.css']
})
export class SendCoinModal {
    @Input() wallet: Wallet;
    coin: MyCoin;
    transFee: number;
    @ViewChild('sendCoinModal', {static: true}) public sendCoinModal: ModalDirective;
    @Output() confirmedCoinSent = new EventEmitter<SendCoinForm>();
    currentCoinIndex: number;
    currentCoinBalance: number;

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
    constructor(private fb: FormBuilder, private coinServ: CoinService) {
        this.currentCoinIndex = 0;
        this.transFee = 0;
        
        if (this.wallet) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
            console.log('this.coin111==', this.coin);
        }
        
    }

    onSubmit() {
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

    onChange(index: number) {
        this.coin = this.wallet.mycoins[index];
        if ((this.coin.name === 'ETH') || (this.coin.tokenType === 'ETH')) {
            this.sendCoinForm.get('gasPrice').setValue(environment.chains.ETH.gasPrice);
            this.sendCoinForm.get('gasLimit').setValue(environment.chains.ETH.gasLimit);
        } else 
        if ((this.coin.name === 'FAB') || (this.coin.name === 'BTC')) {
            this.sendCoinForm.get('satoshisPerBytes').setValue(environment.chains.FAB.satoshisPerBytes);
        } else 
        if (this.coin.tokenType === 'FAB') {
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
