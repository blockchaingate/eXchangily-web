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
    production: boolean;

    constructor (_utilServ: UtilService) {
        this.utilService = _utilServ;
        this.production = environment.production;
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
            const baseUrl = this.production ? 'https://live.blockcypher.com/btc' : 'https://live.blockcypher.com/btc-testnet';
            return baseUrl + '/tx/' + txid + '/';
        } else
        if(chain == 'ETH') {
            const baseUrl = this.production ? 'https://etherscan.io' : 'https://ropsten.etherscan.io';
            return baseUrl + '/tx/' + txid;
        } else
        if(chain == 'FAB') {
            const baseUrl = this.production ? 'https://fabexplorer.info' : 'https://fabtest.info'
            return baseUrl + '/#/transactions/' + txid;
        } else
        if(chain == 'LTC') {
            return 'https://live.blockcypher.com/ltc/tx/' + txid + '/';
        } else
        if(chain == 'DOGE') {
            return 'https://dogechain.info/tx/' + txid;
        } else
        if(chain == 'BCH') {
            return 'https://explorer.bitcoin.com/bch/tx/' + txid;
        } else
        if(chain == 'TRX') {
            return 'https://tronscan.org/#/transaction/' + txid;
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
