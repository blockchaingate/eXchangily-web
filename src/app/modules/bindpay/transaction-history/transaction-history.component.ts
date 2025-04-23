import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-bindpay-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss'],
    providers: []
  })

export class TransactionHistoryComponent  implements OnInit {
    @Input() transactionHistories: any;
    ngOnInit() {

    }

    showTxid(txid: string) {
        return txid.substring(0, 4) + '...' + txid.substring(txid.length - 2);
    }      
}