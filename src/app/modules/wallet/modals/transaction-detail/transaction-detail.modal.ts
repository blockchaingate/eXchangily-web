import { Component, ViewChild} from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { TransactionItem } from '../../../../models/transaction-item';
import {UtilService} from '../../../../services/util.service';
import { MyCoin } from 'src/app/models/mycoin';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'transaction-detail-modal',
    templateUrl: './transaction-detail.modal.html',
    styleUrls: ['./transaction-detail.modal.css']
})
export class TransactionDetailModal {
    @ViewChild('transactionDetailModal', {static: true}) public transactionDetailModal: ModalDirective;   
    coin: MyCoin;
    utilService: UtilService;
    transactions: TransactionItem[] = [];

    constructor (_utilServ: UtilService, private apiServ: ApiService) {
        this.utilService = _utilServ;
    }

    show(coin: MyCoin) {
        this.coin = coin;
        const chain = coin.tokenType ? coin.tokenType : coin.name;
        const native = coin.receiveAdds[0].address;
        const contractAddress = coin.contractAddr;

        this.apiServ.getTransactionHistory(chain, native, contractAddress).subscribe(
            (transactions: any) => {
                this.transactions = transactions;
            }
        );
        this.transactionDetailModal.show();
    }

    hide() {
        this.transactionDetailModal.hide();
    }    
}
