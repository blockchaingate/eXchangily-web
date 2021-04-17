import { Injectable } from '@angular/core';
import { timer, BehaviorSubject } from 'rxjs';
import { KanbanService } from './kanban.service';
import { TransactionItem } from '../models/transaction-item';
import { ApiService } from './api.service';

@Injectable()
export class TimerService {
    private timerEnabled: boolean;
    private transactionStatusSubscribe: any;
    private orderStatusSubscribe: any;
    private tokenSubscribe: any;

    private maxTimes: number;

    public transactionStatus: BehaviorSubject<any> = new BehaviorSubject({});
    public openOrders: BehaviorSubject<any> = new BehaviorSubject([]);
    public closedOrders: BehaviorSubject<any> = new BehaviorSubject([]);
    public canceledOrders: BehaviorSubject<any> = new BehaviorSubject([]);
    public tokens: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(public kanbanServ: KanbanService, private apiServ: ApiService) { 
        this.transactionStatusSubscribe = [];
        this.orderStatusSubscribe = [];
        this.tokenSubscribe = [];
        this.timerEnabled = true;
        this.maxTimes = 0;
    }

    unCheckTokens(address: string) {
        for (let i = 0; i < this.tokenSubscribe.length; i++) {
            const item = this.tokenSubscribe[i];
            if (item.address === address) {
                item.subscribeItem.unsubscribe();
                this.tokenSubscribe.splice(i, 1);
                break;
            }
        }
    }

    checkTokens(address: string, maxTimes = 160) {
        if (this.maxTimes > 0) {
            maxTimes = this.maxTimes;
        }
        if (!this.timerEnabled) {
            return;
        }
        // console.log('begin checkint');
        for (let i = 0; i < this.tokenSubscribe.length; i++) {
            const item = this.tokenSubscribe[i];
            if (item.address === address) {
                return;
            }
        }

        const source = timer(1000, 1000);

        const subscribeItem = source.subscribe(val => {
            // console.log('value for checking order ' + val);
            // console.log('maxTimes=' + maxTimes);
            if ((maxTimes > 0) && (val >= maxTimes - 1)) {

                this.unCheckTokens(address);
            }
            this.kanbanServ.getBalance(address).subscribe((resp) => {
                this.tokens.next(resp);
            });          
        });   
        
        this.tokenSubscribe.push(
            {
                address: address,
                subscribeItem: subscribeItem
            }
        );
    }

    unCheckOrderStatus(address: string) {
        for (let i = 0; i < this.orderStatusSubscribe.length; i++) {
            const item = this.orderStatusSubscribe[i];
            if (item.address === address) {
                item.subscribeItem.unsubscribe();
                this.orderStatusSubscribe.splice(i, 1);
                break;
            }
        }
    }

    checkOrderStatus(address: string, maxTimes = 160) {
        if (this.maxTimes > 0) {
            maxTimes = this.maxTimes;
        }      
        if (!this.timerEnabled) {
            return;
        }       
        // console.log('begin checkint');
        for (let i = 0; i < this.orderStatusSubscribe.length; i++) {
            const item = this.orderStatusSubscribe[i];
            if (item.address === address) {
                return;
            }
        }
        const source = timer(1000, 1000);
        const subscribeItem = source.subscribe(val => {
            if ((maxTimes > 0) && (val >= maxTimes - 1)) {
                this.unCheckOrderStatus(address);
            }
            this.kanbanServ.getOrdersByAddressStatus(address, 'open')
            .subscribe(
                (orders: any) => { 
                    // console.log('ordersssssssssssssssssss=', orders);
                    this.openOrders.next(orders);
                }
            );   

            this.kanbanServ.getOrdersByAddressStatus(address, 'closed')
            .subscribe(
                (orders: any) => { 
                    // console.log('ordersssssssssssssssssss=', orders);
                    this.closedOrders.next(orders);
                }
            );   
            
            this.kanbanServ.getOrdersByAddressStatus(address, 'canceled')
            .subscribe(
                (orders: any) => { 
                    // console.log('ordersssssssssssssssssss=', orders);
                    this.canceledOrders.next(orders);
                }
            );             
        });   
        
        this.orderStatusSubscribe.push(
            {
                address: address,
                subscribeItem: subscribeItem
            }
        );
    }

    unCheckAllOrderStatus() {
        for (let i = 0; i < this.orderStatusSubscribe.length; i++) {
            const item = this.orderStatusSubscribe[i];
            item.subscribeItem.unsubscribe();
        }
    }
   
    unCheckAllTransactionStatus() {
        for (let i = 0; i < this.transactionStatusSubscribe.length; i++) {
            const item = this.transactionStatusSubscribe[i];
            item.subscribeItem.unsubscribe();
        }
    }

    unCheckTransactionStatus(txid: string) {
        for (let i = 0; i < this.transactionStatusSubscribe.length; i++) {
            const item = this.transactionStatusSubscribe[i];
            if (item.txid === txid) {
                item.subscribeItem.unsubscribe();
                this.transactionStatusSubscribe.splice(i, 1);
                break;
            }
        }
    }

    checkTransactionStatus(item: TransactionItem, maxTimes = 160) {
        if (this.maxTimes > 0) {
            maxTimes = this.maxTimes;
        }        
        if (!this.timerEnabled) {
            return;
        }
        const txid = item.txid;
        if(!txid) {
            return;
        }
        const type = item.type;
        const coin = item.coin;
        const tokenType = item.tokenType;

        for (let i = 0; i < this.transactionStatusSubscribe.length; i++) {
            const itemS = this.transactionStatusSubscribe[i];
            if (itemS.txid === txid) {
                return;
            }
        }    

        const source = timer(10000, 20000);
        const subscribeItem = source.subscribe(async val => {
            if ((maxTimes > 0) && (val >= maxTimes - 1)) {
                this.unCheckTransactionStatus(txid);
            }
            if (type === 'Withdraw') {
                this.kanbanServ.getTransactionStatusSync(txid).subscribe(
                    (res: any) => {
                        if (res && res.transactionReceipt) {
                            let status = 'failed';
                            if (res.transactionReceipt.status === '0x1') {
                                status = 'confirmed';
                            }
                            this.transactionStatus.next(
                                {
                                    txid: txid,
                                    status: status
                                }
                            );
                            this.unCheckTransactionStatus(txid);
                        }                      
                    }
                );
            } else if (type === 'Deposit') {
                console.log('check deposit status');
                this.kanbanServ.getDepositStatusSync(txid).subscribe((res: any) => {
                    if (res && res.code !== undefined) {
                        const code = res.code;
                        let status = '';
                        if (code === 0) {
                            status = 'confirmed';
                        } else
                        if (code === 2) {
                            status = 'failed';
                        } else
                        if (code === 3) {
                            status = 'claim';
                        }
                        if (status) {
                            // console.log('confirmed, status changed');
                            this.transactionStatus.next(
                                {
                                    txid: txid,
                                    status: status
                                }
                            );
                            this.unCheckTransactionStatus(txid);
                        }
                    }
                }, (error) => {
                    // console.log('error', error);
                });
            } else if (type === 'Send' || type === 'Add Gas') {
                if (coin === 'BTC') {
                    this.apiServ.getBtcTransactionSync(txid).subscribe( (res: any) => {
                        if (res.confirmations && res.confirmations >= 1) {
                            this.transactionStatus.next(
                                {
                                    txid: txid,
                                    status: status
                                }
                            );
                            this.unCheckTransactionStatus(txid);                        
                        }
                    });
                } else if (coin === 'ETH' || tokenType === 'ETH') {
                    this.apiServ.getEthTransactionSync(txid).subscribe( (res: any) => {
                        if (res) {
                            let confirmations = 0;
                            if (res.blockNumber) {
                                confirmations = res.confirmations;
                            }
                            if (confirmations >= 1) {
                                this.apiServ.getEthTransactionStatusSync(txid).subscribe(
                                    (res2: any) => {
                                        let status = 'failed';
                                        if (res2.status) {
                                            status = 'confirmed';
                                        }
                                        this.transactionStatus.next(
                                            {
                                                txid: txid,
                                                status: status
                                            }
                                        );
                                        this.unCheckTransactionStatus(txid);                                        
                                    }
                                );
                            }
                        }
                    });
                } else if (coin === 'FAB' || tokenType === 'FAB') {
                    this.apiServ.getFabTransactionJsonSync(txid).subscribe(
                        (res2: any) => {
                            let confirmations = 0;
                            if (res2.confirmations) {
                                confirmations = res2.confirmations;
                            }
                            if (confirmations >= 1) {
                                const status = 'confirmed';
                                this.transactionStatus.next(
                                    {
                                        txid: txid,
                                        status: status
                                    }
                                );
                                this.unCheckTransactionStatus(txid);                                 
                            }
                        } 
                    );
                } else 
                if(coin == 'TRX' || tokenType == 'TRX') {
                    const status = await this.apiServ.getTrxTransactionStatus(txid);
                    this.transactionStatus.next(
                        {
                            txid: txid,
                            status: status
                        }
                    );
                    if(status == 'confirmed') {
                        this.unCheckTransactionStatus(txid); 
                    }
                }
            }                
        }); 

        this.transactionStatusSubscribe.push(
            {
                txid: item.txid,
                subscribeItem: subscribeItem
            }
        );
       
    }
}
