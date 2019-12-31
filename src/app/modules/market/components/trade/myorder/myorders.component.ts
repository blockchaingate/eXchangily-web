import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
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
import { TimerService } from '../../../../../services/timer.service';
import { WalletService } from '../../../../../services/wallet.service';
import { StorageService } from '../../../../../services/storage.service';
import * as bs58 from 'bs58';
import { environment } from '../../../../../../environments/environment';
@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css']
})

export class MyordersComponent implements OnInit, OnDestroy {
    // @Input() wallet: Wallet;
    private wallet: any;
    screenheight = screen.height;
    select = 0;
    myorders: Transaction[] = [];
    pin: string;
    orderHash: string;
    modalRef: BsModalRef;
    isOpen: boolean;
    mytokens: any;
    opType: string;
    token: any;
    coinType: number;
    coinName: string;
    withdrawAmount: number;
    withdrawModal: TemplateRef<any>;
    interval;
    constructor(private ordServ: OrderService, private _router: Router, private tradeService: TradeService, 
        public utilServ: UtilService, private kanbanServ: KanbanService, private coinServ: CoinService, 
        private modalService: BsModalService, private web3Serv: Web3Service, private alertServ: AlertService,
        private timerServ: TimerService, private walletServ: WalletService, private storageServ: StorageService) {
    }

    /*
    onRefreshToken(tokens) {
        
        this.mytokens = tokens;
        console.log('mytokens in myorders', this.mytokens);
    }
    */
    ngOnDestroy() {
        this.timerServ.unCheckAllOrderStatus();
    }
    async ngOnInit() {
        /*
        this.interval = setInterval(() => {
            if (this._wallet) {
                this.kanbanService.getOrdersByAddress(this._wallet.excoin.receiveAdds[0].address)
                .subscribe(
                    (orders: any) => { 
                        console.log('orders=', orders);
                        this.myorders = orders;
                    }
                );
              }
          }, 1000);   
           */   
        this.isOpen = true;
        this.wallet = await this.walletServ.getCurrentWallet();
        if (this.wallet) {
            const address = this.wallet.excoin.receiveAdds[0].address;
            this.timerServ.checkOrderStatus(address, 1);
            this.timerServ.checkTokens(address, 1);
        }
        this.timerServ.ordersStatus.subscribe(
            (orders: any) => { 
                console.log('orders=', orders);
                this.myorders = orders;
            }            
        );

        this.timerServ.tokens.subscribe(
            (tokens: any) => { 
                // console.log('tokens=', tokens);
                this.mytokens = tokens;
            }            
        );        
        /*
        // console.log('mytokens in myorders=', this.mytokens);
        this.tradeService.getTransactions().subscribe((transactions: Transaction[]) => {
            // console.log('transactions=');
            // console.log(transactions);
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
        */


    }

    async withdrawDo() {
        
        const amount = this.withdrawAmount;
        const pin = this.pin;        

        if (amount < environment.minimumWithdraw[this.coinServ.getCoinNameByTypeId(this.token.coinType)]) {
            this.alertServ.openSnackBar('Your withdraw minimum amount is not satisfied.', 'Ok');
            return;
        }

        if (amount > Number(this.utilServ.showAmount(this.token.unlockedAmount))) {
            this.alertServ.openSnackBar('Your withdraw amount is bigger than your balance.', 'Ok');
            return;
        }
        let currentCoin ;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            currentCoin = this.wallet.mycoins[i];
            if (currentCoin.name === this.coinName) {
                break;
            }
        }
        
        console.log('currentCoin=', currentCoin);
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
            return;   
        }         
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);   
        const amountInLink = amount * 1e18; // it's for all coins.
        let addressInWallet = currentCoin.receiveAdds[0].address;
        if (currentCoin.name === 'BTC' || currentCoin.name === 'FAB') {
            const bytes = bs58.decode(addressInWallet);
            addressInWallet = bytes.toString('hex');
        }
        const abiHex = this.web3Serv.getWithdrawFuncABI(this.coinType, amountInLink, addressInWallet);  
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const includeCoin = true;
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

       
        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, includeCoin); 

        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp: any) => { 
            // console.log('resp=', resp);
            if (resp && resp.transactionHash) {
                const item = {
                    walletId: this.wallet.id, 
                    type: 'Withdraw',
                    coin: currentCoin.name,
                    tokenType: currentCoin.tokenType,
                    amount: amount,
                    txid: resp.transactionHash,
                    time: new Date(),
                    confirmations: '0',
                    blockhash: '', 
                    comment: '',
                    status: 'pending'
                };
                this.storageServ.storeToTransactionHistoryList(item);
                this.timerServ.transactionStatus.next(item);
                this.timerServ.checkTransactionStatus(item);    
                this.modalRef.hide();
                this.alertServ.openSnackBar('Your withdraw request is pending.', 'Ok');  
            } else {
                this.alertServ.openSnackBar('Some error happened. Please try again.', 'Ok');  
            }
        }); 
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'second' });
    }

    selectOrder(ord: number) {

        this.select = ord;
        if (ord === 0) {
            this.isOpen = true;
        } else
        if (ord === 1) {
            this.isOpen = false;
        }
    }
    deleteOrder(pinModal: TemplateRef<any>, orderHash: string) {
        console.log('orderHash=' + orderHash);
        this.orderHash = orderHash;
        this.opType = 'deleteOrder';
        this.pin = sessionStorage.getItem('pin');
        if (this.pin) {
            this.deleteOrderDo();
        
        } else {
            this.openModal(pinModal);
        }
    }

    withdraw(pinModal: TemplateRef<any>, withdrawModal: TemplateRef<any>, token) {
        this.token = token;
        console.log('token=', this.token);

        this.coinType = Number(this.token.coinType);

        this.coinName = this.coinServ.getCoinNameByTypeId(this.coinType);        
        this.opType = 'withdraw';
        this.pin = sessionStorage.getItem('pin');
        if (this.pin) {  
            this.openModal(withdrawModal);
            //this.withdrawDo();
        
        } else {
            this.withdrawModal = withdrawModal;
            this.openModal(pinModal);
        }        
    }
    confirmPin() {

        const pwdHashStr = this.utilServ.SHA256(this.pin).toString();
        if (this.wallet.pwdHash !== pwdHashStr) {
          this.alertServ.openSnackBar('Your password is invalid', 'Ok');
          return;
        }

        sessionStorage.setItem('pin', this.pin);
        if (this.opType === 'deleteOrder') {
            this.deleteOrderDo();
        } else 
        if (this.opType === 'withdraw') {
            this.openModal(this.withdrawModal);
        }
        
        this.modalRef.hide();
    }

    async deleteOrderDo() {

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);        
        const abiHex = this.web3Serv.getDeleteOrderFuncABI(this.orderHash);

        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        const includeCoin = true;
        const address = await this.kanbanServ.getExchangeAddress();
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, includeCoin); 
          console.log('txhex=', txhex);
        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
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
