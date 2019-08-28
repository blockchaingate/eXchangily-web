import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import {SendCoinForm} from '../../../../interfaces/kanban.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import { ApiService } from '../../../../services/api.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { WalletService } from '../../../../services/wallet.service';
import {StorageService} from '../../../../services/storage.service';
import { MyCoin} from '../../../../models/mycoin';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'send-coin-modal',
    templateUrl: './send-coin.modal.html',
    styleUrls: ['./send-coin.modal.css']
})
export class SendCoinModal {
    @Input() wallet: Wallet;
    @ViewChild('sendCoinModal', {static: true}) public sendCoinModal: ModalDirective;
    @Output() confirmedCoinSent = new EventEmitter<SendCoinForm>();
    currentCoinIndex: number;
    currentCoinBalance: number;

    sendCoinForm = this.fb.group({
        sendTo: [''],
        sendAmount: [''],
        selectedCoinIndex: [0]
    });     
    constructor(private fb: FormBuilder) {
        //this.setCurrentCoinIndex(0);
    }



    /*
    setCurrentCoinIndex(i: number) {
        this.currentCoinIndex = i;
        if (this.wallet) {
            this.currentCoinBalance = this.wallet.mycoins[i].balance;
        } else {
            this.currentCoinBalance = 0;
        }
    }
    */
    onSubmit() {
        const sendCoinForm = {
            to: this.sendCoinForm.get('sendTo').value,
            coinIndex: Number(this.sendCoinForm.get('selectedCoinIndex').value),
            amount: Number(this.sendCoinForm.get('sendAmount').value)
        };
        this.confirmedCoinSent.emit(sendCoinForm);
        this.hide();        
    }

    show() {
        this.sendCoinModal.show();
    }

    hide() {
        this.sendCoinModal.hide();
    }






    /*
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    @Input() wallet: Wallet;
    currentCoinIndex: number;

    sendCoinForm = this.fb.group({
        sendTo: [''],
        sendAmount: [''],
        coin: ['EXG']
    });    

    pinForm = this.fb.group({
        pin: ['']
    }); 


    constructor(private modalService: BsModalService, private apiService: ApiService, private walletService: WalletService,
        private fb: FormBuilder, private utilService: UtilService, 
        private coinService: CoinService, private storageService: StorageService) {
        this.currentCoinIndex = 0;
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }  

    onChange(index: number) {
        console.log(index);
        this.currentCoinIndex = index;
        // this.wallet.mycoins[index].receiveAdds[0].address;
        // console.log(selectedValue);
    }     


    async onSubmitPin() {
        const pin = this.pinForm.get('pin').value;
        const currentCoin = this.wallet.mycoins[this.currentCoinIndex];

        const seed = this.utilService.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        
        const amount = Number(this.sendCoinForm.get('sendAmount').value);
        const doSubmit = true;
        const {txHex, txHash} = await this.coinService.sendTransaction(currentCoin, seed, 
            this.sendCoinForm.get('sendTo').value, amount, doSubmit
        );
        if (txHex) {
            const today = new Date();
            const item = {
                type: 'Send',
                coin: currentCoin.name,
                amount: amount,
                txid: txHash,
                time: today, 
                comment: ''
            };
            this.storageService.storeToTransactionHistoryList(item);
        }
    }
    openPinModal(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'second' });
    }

*/





}
