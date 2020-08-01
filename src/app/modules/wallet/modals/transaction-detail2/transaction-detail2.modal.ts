import { Component, ViewChild} from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { TransactionItem } from '../../../../models/transaction-item';
import {UtilService} from '../../../../services/util.service';
import {environment} from '../../../../../environments/environment';
@Component({
    selector: 'transaction-detail2-modal',
    templateUrl: './transaction-detail2.modal.html',
    styleUrls: ['./transaction-detail2.modal.css']
})
export class TransactionDetailModal2 {
    @ViewChild('transactionDetailModal2', {static: true}) public transactionDetailModal2: ModalDirective;
    item: any;
    utilService: UtilService;

    constructor (_utilServ: UtilService) {
        this.utilService = _utilServ;
    }

    getTo(item) {
        if(item.coin == 'EXG') {
            return this.utilService.exgToFabAddress(item.to);
        }
        return item.to;
    }
    getTxUrl(tx) {
        const chain = tx.chain;
        const txid = tx.transactionId;
        if(chain == 'KANBAN') {
            return  environment.baseUrl + '/explorer/tx-detail/' + txid;
        } else
        if(chain == 'BTC') {
            return 'https://live.blockcypher.com/btc/tx/' + txid + '/';
        } else
        if(chain == 'ETH') {
            return 'https://etherscan.io/tx/' + txid;
        } else
        if(chain == 'FAB') {
            return 'https://fabexplorer.info/#/transactions/' + txid;
        } else
        if(chain == 'LTC') {
            return 'https://live.blockcypher.com/ltc/tx/' + txid + '/';
        } else
        if(chain == 'DOGE') {
            return 'https://dogechain.info/tx/' + txid;
        } else
        if(chain == 'BCH') {
            return 'https://explorer.bitcoin.com/bch/tx/' + txid;
        }
    }

    show(item: any) {
        this.item = item;
        console.log('this.item=', this.item);
        this.transactionDetailModal2.show();
    }

    hide() {
        this.transactionDetailModal2.hide();
    }    
}
