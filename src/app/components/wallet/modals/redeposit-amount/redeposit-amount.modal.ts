import { Component, ViewChild, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { AlertService } from '../../../../services/alert.service';
import { UtilService } from '../../../../services/util.service';
import BigNumber from 'bignumber.js';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'redeposit-amount-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, MatFormFieldModule, MatInputModule, FormsModule, TranslateModule],
    templateUrl: './redeposit-amount.modal.html',
    styleUrls: ['./redeposit-amount.modal.css']
})
export class RedepositAmountModal implements OnInit {
    @ViewChild('depositModal', { static: true }) public depositModal: ModalDirective = {} as ModalDirective;
    coin: MyCoin = {} as MyCoin;
    redeposit: any;
    @Output() confirmedAmount = new EventEmitter<any>();
    showDetailIndex = 0;
    transactionID = '';
    gasFeeCustomChecked = false;

    constructor(private alertServ: AlertService, public utilServ: UtilService) {
    }

    ngOnInit() {
        this.showDetailIndex = -1;
    }

    showDetail(i: number) {
        this.showDetailIndex = i;
    }

    copyTransactionID(txid: string) {
        this.utilServ.copy(txid);
    }

    setTransactionID(txid: string) {
        this.transactionID = txid;
    }

    onSubmit() {
        const data = {
            transactionID: this.transactionID
        };
        this.confirmedAmount.emit(data);
        this.hide();
    }

    show(coin: MyCoin) {
        this.coin = coin;
        this.depositModal.show();
    }

    hide() {
        this.depositModal.hide();
    }

}
