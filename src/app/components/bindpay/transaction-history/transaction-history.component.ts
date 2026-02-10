import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-bindpay-transaction-history',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule,],
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