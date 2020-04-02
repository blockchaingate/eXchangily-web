import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import { environment } from '../../environments/environment';
@Injectable()
export class CampaignOrderService {
    constructor(private httpServ: HttpService) {
    } 

    addOrder(data) {
        return this.httpServ.post(environment.endpoints.blockchaingate + 'campaign-order/create', data);
    }
    getOrders(token: string) {
        return this.httpServ.get(environment.endpoints.blockchaingate + 'campaign-order?token=' + token);
    }

    getRewards(token: string) {
        return this.httpServ.get(environment.endpoints.blockchaingate + 'campaign-order/rewards?token=' + token);
    }

    getProfile(token: string) {
        return this.httpServ.get(environment.endpoints.blockchaingate + 'campaign-order/profile?token=' + token);
    }

    getStatusText(status: number) {
        if(status == 1) {
            return 'waiting for payment';
        } else 
        if(status == 2) {
            return 'marked as paid';
        } else 
        if(status == 3) {
            return 'payment confimed';
        } else 
        if(status == 4) {
            return 'failed';
        } else 
        if(status == 5) {
            return 'cancelled';
        }
        return 'unknown';                               
        // status: 1 - waiting for payment; 2 - marked as paid; 3 - payment confimed; 4- failed; 5 - cancelled;
    }    
}
