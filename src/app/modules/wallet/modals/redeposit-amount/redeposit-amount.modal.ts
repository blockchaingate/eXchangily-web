import { Component, ViewChild, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { AlertService } from '../../../../services/alert.service';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import { UtilService } from '../../../../services/util.service';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'redeposit-amount-modal',
    templateUrl: './redeposit-amount.modal.html',
    styleUrls: ['./redeposit-amount.modal.css']
})
export class RedepositAmountModal implements OnInit {
    @ViewChild('depositModal', { static: true }) public depositModal: ModalDirective;
    @Input() coin: MyCoin;
    @Output() confirmedAmount = new EventEmitter<any>();
    showDetailIndex: number;
    gasPrice = environment.chains.KANBAN.gasPrice;
    gasLimit = environment.chains.KANBAN.gasLimit;
    transactionID: string;
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
            gasPrice: this.gasPrice,
            gasLimit: this.gasLimit,
            transactionID: this.transactionID
        };
        console.log('data==', data);
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
