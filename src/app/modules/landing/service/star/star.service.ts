import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class StarService {
    constructor(private http: HttpService) { }

    getAllOrders(token: string) {
        return this.http.get(environment.endpoints.blockchaingate + '7star-order?token=' + token);
    }

    getAllEvents(token: string) {
        return this.http.get(environment.endpoints.blockchaingate + '7star-event?token=' + token);
    }

    getEvent(id: string, token: string) {
        return this.http.get(environment.endpoints.blockchaingate + '7star-event/' + id + '?token=' + token);
    }
    
    getPayments(orderId: string) {
        return this.http.get(environment.endpoints.blockchaingate + '7star-payment/order/' + orderId + '/all');
    }

    changeOrderStatus(id: string, status:number, token: string) {
        const url = environment.endpoints.blockchaingate + '7star-order/update';
        const body = {
           token: token,
           id: id,
           status: status
        }
        return this.http.post(url, body);
    }
    
    upsertSetting(setting: any, token: string) {
        const url = environment.endpoints.blockchaingate + '7star-setting/upsert?token=' + token;
        return this.http.post(url, setting);        
    }

    getSetting(id: string, token: string) {
        const url = environment.endpoints.blockchaingate + '7star-setting/' + id + '?token=' + token;
        return this.http.get(url);
    }

    getSettings(token: string) {
        const url = environment.endpoints.blockchaingate + '7star-setting?token=' + token;
        return this.http.get(url);        
    }
}