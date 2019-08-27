import { Component, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import { ApiService } from '../../../../services/api.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { WalletService } from '../../../../services/wallet.service';
import { MyCoin} from '../../../../models/mycoin';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'modal-send-coin',
    templateUrl: './send-coin.modal.html',
    styleUrls: ['./send-coin.modal.css']
})
export class SendCoinModal {
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


    constructor(private modalService: BsModalService, private apiService: ApiService, private walletService:WalletService,
        private fb: FormBuilder, private utilService:UtilService, private coinService: CoinService) {
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
    changeCoin(e: any) {
        this.currentCoinIndex = e;
    }  

    async onSubmitPin() {
        const pin = this.pinForm.get('pin').value;
        const currentCoin = this.wallet.mycoins[this.currentCoinIndex];

        const seed = this.utilService.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        
        const amount = Number(this.sendCoinForm.get('sendAmount').value);
        const doSubmit = true;
        const txHex = await this.coinService.sendTransaction(currentCoin, seed, 
            this.sendCoinForm.get('sendTo').value, amount, doSubmit
        );

    }
    openPinModal(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'second' });
      }

}
