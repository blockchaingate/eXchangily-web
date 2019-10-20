import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from '../../../services/order.service';
import { TradeService } from '../../../services/trade.service';
import { CoinService } from '../../../../../services/coin.service';
import { UtilService } from '../../../../../services/util.service';
import { KanbanService } from '../../../../../services/kanban.service';
import {TransactionReceiptResp, Transaction} from '../../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../../models/wallet';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Web3Service } from '../../../../../services/web3.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css']
})

export class MyordersComponent implements OnInit {
    @Input() wallet: Wallet;
    private _mytokens: any;
    screenheight = screen.height;
    select = 0;
    myorders: Transaction[] = [];
    address: string;
    pin: string;
    orderHash: string;
    modalRef: BsModalRef;

    constructor(private ordServ: OrderService, private _router: Router, private tradeService: TradeService, 
        private utilServ: UtilService, private kanbanService: KanbanService, private coinService: CoinService, 
        private modalService: BsModalService, private web3Serv: Web3Service, private alertServ: AlertService) {
    }

    @Input()
    set mytokens(mytokens: any) {
      this._mytokens = mytokens;
    }
  
    get mytokens(): any { return this._mytokens; }

    /*
    onRefreshToken(tokens) {
        
        this.mytokens = tokens;
        console.log('mytokens in myorders', this.mytokens);
    }
    */
    ngOnInit() {
        // console.log('mytokens in myorders=', this.mytokens);
        this.tradeService.getTransactions().subscribe((transactions: Transaction[]) => {
            console.log('transactions=');
            console.log(transactions);
            if (!transactions) {
                transactions = [];
            }
            this.myorders = transactions;
            for (let i = 0; i < this.myorders.length; i++) {
                const tx = this.myorders[i];

                this.kanbanService.get('kanban/getTransactionReceipt/' + tx.txid).subscribe((resp: TransactionReceiptResp) => {
                    // console.log('resp===');
                    // console.log(resp);

                    if (resp && resp.transactionReceipt) {
                        tx.status = resp.transactionReceipt.status;
                        // console.log('tx.status=' + tx.status);
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
        console.log('orderHash=' + orderHash);
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

    async deleteOrderDo() {
        console.log('this.pin=' + this.pin);
        console.log('this.orderHash=' + this.orderHash);

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        const keyPairsKanban = this.coinService.getKeyPairs(this.wallet.excoin, seed, 0, 0);        
        const abiHex = this.web3Serv.getDeleteOrderFuncABI(this.orderHash);

        const nonce = await this.kanbanService.getTransactionCount(keyPairsKanban.address);

        const includeCoin = true;
        const address = await this.kanbanService.getExchangeAddress();
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, includeCoin); 
          console.log('txhex=', txhex);
        this.kanbanService.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
            console.log('resp=', resp);
            if (resp && resp.transactionHash) {     
                // this.tradeService.deleteTransaction(this.orderHash);   

                for (let i = 0; i < this.myorders.length; i++) {
                    if (this.myorders[i].orderHash === this.orderHash) {
                        this.myorders.splice(i, 1);
                        break;
                    }
                }   
                
                this.tradeService.saveTransactions(this.myorders);
                this.alertServ.openSnackBar('Delete Order successfully.', 'Ok');
            }
        });
    }
}
