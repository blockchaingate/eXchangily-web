import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import {SendCoinForm} from '../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../models/wallet';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';

@Component({
    selector: 'send-coin-modal',
    templateUrl: './send-coin.modal.html',
    styleUrls: ['./send-coin.modal.css']
})
export class SendCoinModal {
    @Input() wallet: Wallet;
    coin: MyCoin;
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
        gasPrice: [1.2],
        gasLimit: [21000],
        satoshisPerByte: [14]
    });     
    constructor(private fb: FormBuilder) {
        this.currentCoinIndex = 0;
        if (this.wallet) {
            this.coin = this.wallet[this.currentCoinIndex];
        }
        
    }

    onSubmit() {
        const theForm = {
            to: this.sendCoinForm.get('sendTo').value,
            coinIndex: Number(this.sendCoinForm.get('selectedCoinIndex').value),
            amount: Number(this.sendCoinForm.get('sendAmount').value),
            comment: this.sendCoinForm.get('comment').value,
            gasPrice: this.sendCoinForm.get('gasPrice').value ? Number(this.sendCoinForm.get('gasPrice').value) : 0,
            gasLimit: this.sendCoinForm.get('gasLimit').value ? Number(this.sendCoinForm.get('gasLimit').value) : 0,
            satoshisPerByte: this.sendCoinForm.get('satoshisPerByte').value ? Number(this.sendCoinForm.get('satoshisPerByte').value) : 0
        };
        this.confirmedCoinSent.emit(theForm);
        this.hide();        
    }
    onChange(index: number) {
        this.coin = this.wallet.mycoins[index];
        if (this.coin.name === 'ETH') {
            this.sendCoinForm.get('gasLimit').setValue(21000);
        } else 
        if (this.coin.tokenType === 'ETH') {
            this.sendCoinForm.get('gasLimit').setValue(55000);
        }
    }
    show() {
        this.sendCoinModal.show();
    }

    hide() {
        this.sendCoinModal.hide();
    }

}
