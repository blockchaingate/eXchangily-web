import { Injectable } from '@angular/core';
import { timer, BehaviorSubject } from 'rxjs';
import { KanbanService } from './kanban.service';
import { TransactionItem } from '../models/transaction-item';
import { ApiService } from './api.service';

@Injectable()
export class TimerService {

    public transactionStatus: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(public kanbanServ: KanbanService, private apiServ: ApiService) { }

    checkTransactionStatus(item: TransactionItem, maxTimes = 160) {

        console.log('checkTransactionStatus');
        const source = timer(1000, 2000);

        const txid = item.txid;
        const type = item.type;
        const coin = item.coin;
        const tokenType = item.tokenType;
        
        const subscribe = source.subscribe(val => {
            console.log('val=', val);
            if (val >= maxTimes) {
                subscribe.unsubscribe();
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
                            subscribe.unsubscribe();
                        }                      
                    }
                );
            } else
            if (type === 'Deposit') {
                this.kanbanServ.getDepositStatusSync(txid).subscribe((res: any) => {
                    console.log('res=', res);
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
                            console.log('confirmed, status changed');
                            this.transactionStatus.next(
                                {
                                    txid: txid,
                                    status: status
                                }
                            );
                            subscribe.unsubscribe();
                        }
                    }
                });
            } else
            if (type === 'Send' || type === 'Add Gas') {
                if (coin === 'BTC') {
                    this.apiServ.getBtcTransactionSync(txid).subscribe( (res: any) => {
                        if (res.confirmations && res.confirmations >= 1) {
                            this.transactionStatus.next(
                                {
                                    txid: txid,
                                    status: status
                                }
                            );
                            subscribe.unsubscribe();                        
                        }
                    });
                } else
                if (coin === 'ETH' || tokenType === 'ETH') {
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
                                        subscribe.unsubscribe();                                         
                                    }
                                );
                            }
                        }
                    });
                } else
                if (coin === 'FAB' || tokenType === 'FAB') {
                    this.apiServ.getFabTransactionJsonSync(txid).subscribe(
                        (res2: any) => {
                            let confirmations = 0;
                            if (res2.confirmations) {
                                confirmations = res2.confirmations;
                            }
                            if (confirmations >= 1) {
                                const status = 'confirmed';
                                console.log('confirmeddddddddddddddddddddddddddddddddddd');
                                this.transactionStatus.next(
                                    {
                                        txid: txid,
                                        status: status
                                    }
                                );
                                subscribe.unsubscribe();                                   
                            }
                        } 
                    );
                }
            }                
        }); 

       
    }
}

/*
          if (type === 'Withdraw') {
            const status = await this.kanbanServ.getTransactionStatus(txid);
            transaction.status = status;
*/
