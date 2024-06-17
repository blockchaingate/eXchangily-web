import { Injectable } from '@angular/core';
import { timer, BehaviorSubject } from 'rxjs';
import { KanbanService } from './kanban.service';
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
            this.kanbanServ.getBalance(address).subscribe((resp: any) => {
                console.log('resp of tokens=', resp);
                if(resp.success) {
                    this.tokens.next(resp.data);
                }
                
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
        const source = timer(2000, 2000);
        const subscribeItem = source.subscribe(val => {
            if ((maxTimes > 0) && (val >= maxTimes - 1)) {
                this.unCheckOrderStatus(address);
            }
            this.kanbanServ.getOrdersByAddressStatus(address, 'open')
            .subscribe(
                (ret: any) => { 
                    // console.log('ordersssssssssssssssssss=', orders);
                    if(ret.success) {
                        const orders = ret.data;
                        this.openOrders.next(orders);
                    }
                    
                }
            );   

            this.kanbanServ.getOrdersByAddressStatus(address, 'closed')
            .subscribe(
                (ret: any) => { 
                    if(ret.success) {
                        const orders = ret.data;
                        this.closedOrders.next(orders);
                    }

                }
            );   
            
            this.kanbanServ.getOrdersByAddressStatus(address, 'canceled')
            .subscribe(
                (ret: any) => { 
                    if(ret.success) {
                        const orders = ret.data;
                        this.canceledOrders.next(orders);
                    }

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
   


}
