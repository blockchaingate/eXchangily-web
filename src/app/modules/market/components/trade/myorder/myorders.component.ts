import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../../services/order.service';
import { TradeService } from '../../../services/trade.service';
import { KanbanService } from '../../../../../services/kanban.service';
import {TransactionReceipt, TransactionReceiptResp, Transaction} from '../../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../../models/wallet';

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css']
})

export class MyordersComponent implements OnInit {
    @Input() wallet: Wallet;
    screenheight = screen.height;
    select = 21;
    myorders: Transaction[] = [];
    address: string;

    constructor(private ordServ: OrderService, private _router: Router, private tradeService: TradeService, 
        private kanbanService: KanbanService) {
    }

    ngOnInit() {
        this.tradeService.getTransactions().subscribe((transactions: Transaction[]) => {
            console.log('transactions=');
            console.log(transactions);
            if (!transactions) {
                transactions = [];
            }
            this.myorders = transactions;
            for (let i = 0; i < this.myorders.length; i++) {
                const tx = this.myorders[i];

                this.kanbanService.get('/kanban/getTransactionReceipt/' + tx.txid).subscribe((resp: TransactionReceiptResp) => {
                    console.log('resp===');
                    console.log(resp);

                    if (resp && resp.transactionReceipt) {
                        tx.status = resp.transactionReceipt.status;
                        console.log('tx.status=' + tx.status);
                    }

                });
            }
        }); 
        


    }

    selectOrder(ord: number) {
        if (ord === 100) {
            if (this.wallet && this.wallet.excoin && this.wallet.excoin.receiveAdds) {
                this.address = this.wallet.excoin.receiveAdds[0].address;
                console.log('this.address=' + this.address);
                if (this.address) {
                    this.kanbanService.get('/kanban/getBalance/' + this.address).subscribe((resp) => {
                        console.log('resp from getBalances===');
                        console.log(resp);
                    });
                }                
            }   
        } 
     
        this.select = ord;
    }

}
