import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {StorageService} from '../../../../services/storage.service';
import { TransactionItem } from '../../../../models/transaction-item';
import {CoinsPrice} from '../../../../interfaces/balance.interface';
import {UtilService} from '../../../../services/util.service';
import {ApiService} from '../../../../services/api.service';
import { TransactionDetailModal } from '../../modals/transaction-detail/transaction-detail.modal';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

    @ViewChild('transactionDetailModal', {static: true}) transactionDetailModal: TransactionDetailModal;


    transactionHistory: TransactionItem[];
    @Input() coinsPrice: CoinsPrice;
    @Input() walletId: string;
    currentType: string;
    constructor ( private storageService: StorageService, private apiServ: ApiService, private utilServ: UtilService ) {

    }
    changeType(type: string) {
        this.currentType = type;
    }
    ngOnInit() {
        this.currentType = 'All';
        this.storageService.getTransactionHistoryList().subscribe(
            (transactionHistory: TransactionItem[]) => {
                console.log('transactionHistory=', transactionHistory);
                if (transactionHistory) {
                    this.transactionHistory = transactionHistory.reverse().filter( s => s.walletId === this.walletId);
                }
            }
        );
    }

    async showTransactionDetail(item: TransactionItem) {
        console.log('item is:', item);
        if (item.coin === 'BTC') {
            const tx = await this.apiServ.getBtcTransaction(item.txid);
            item.confirmations = tx.confirmations;
            item.blockhash = tx.blockhash;
        } else 
        if (item.coin === 'ETH' || item.tokenType === 'ETH') {
            const tx = await this.apiServ.getEthTransaction(item.txid);
            item.confirmations = '0';
            if (tx.blockNumber) {
                item.confirmations = tx.confirmations;
            }
            item.blockhash = tx.blockHash;            
        } else
        if (item.coin === 'FAB' || item.tokenType === 'FAB') {
            const tx = await this.apiServ.getFabTransactionJson(item.txid);
            console.log('tx in fab token:', tx);
            item.confirmations = '0';
            if (tx.confirmations) {
                item.confirmations = tx.confirmations.toString();
            }
            item.blockhash = tx.blockhash;    
        } 
        this.transactionDetailModal.show(item);
    }
}
