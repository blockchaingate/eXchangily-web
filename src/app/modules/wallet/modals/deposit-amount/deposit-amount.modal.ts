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
    selector: 'deposit-amount-coin',
    templateUrl: './deposit-amount.modal.html',
    styleUrls: ['./deposit-amount.modal.css']
})
export class DepositAmountModal {
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    @Input() wallet: Wallet;
    currentCoinIndex: number;

    depositAmountForm = this.fb.group({
        depositAmount: ['']
    });    

    constructor(private modalService: BsModalService, private apiService: ApiService, private walletService:WalletService,
        private fb: FormBuilder, private utilService:UtilService, private coinService: CoinService) {
        this.currentCoinIndex = 0;
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }  

}
