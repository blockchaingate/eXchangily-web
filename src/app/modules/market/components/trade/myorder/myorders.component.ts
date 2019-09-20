import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from '../../../services/order.service';
import { TradeService } from '../../../services/trade.service';
import { CoinService } from '../../../../../services/coin.service';

import { KanbanService } from '../../../../../services/kanban.service';
import {TransactionReceiptResp, Transaction} from '../../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../../models/wallet';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css']
})

export class MyordersComponent implements OnInit {
    @Input() wallet: Wallet;
    @Input() mytokens: any;
    screenheight = screen.height;
    select = 0;
    myorders: Transaction[] = [];
    address: string;
    pin: string;
    orderHash: string;
    modalRef: BsModalRef;

    constructor(private ordServ: OrderService, private _router: Router, private tradeService: TradeService, 
        private kanbanService: KanbanService, private coinService: CoinService, private modalService: BsModalService) {
    }

    onRefreshToken(tokens) {
        
        this.mytokens = tokens;
        console.log('mytokens in myorders', this.mytokens);
    }

    ngOnInit() {
        console.log('mytokens in myorders=', this.mytokens);
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
                    //console.log('resp===');
                    //console.log(resp);

                    if (resp && resp.transactionReceipt) {
                        tx.status = resp.transactionReceipt.status;
                        //console.log('tx.status=' + tx.status);
                    }

                });
            }
        }); 
        


    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'second' });
    }

    selectOrder(ord: number) {

        this.select = ord;
    }
    deleteOrder(pinModal: TemplateRef<any>, orderHash: string) {
        this.orderHash = orderHash;
        this.pin = sessionStorage.getItem('pin');
        if (this.pin) {
            this.deleteOrderDo();
        
        } else {
            this.openModal(pinModal);
        }
    }

    confirmPin() {
        sessionStorage.setItem('pin', this.pin);
        this.deleteOrderDo();
        this.modalRef.hide();
    }

    deleteOrderDo() {
        console.log('this.pin=' + this.pin);
    }
}
