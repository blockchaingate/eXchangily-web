import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CampaignOrderService {
    constructor(private translate: TranslateService, private httpServ: HttpService) {
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
    confirmMarkedAsPaid(token: string, order_id: string, comment: string) {
        const data = {
            token: token,
            paymentDesc: comment
        }
        return this.httpServ.post(environment.endpoints.blockchaingate + 'campaign-order/' + order_id + '/confirmMarkedAsPaid', data);
    }
    
    getStatusText(status: number) {
        const lang = this.translate.currentLang;
        if(status == 1) {
            if(lang == 'zh') {
                return '等待支付';
            } 
            return 'waiting for payment';
        } else 
        if(status == 2) {
            if(lang == 'zh') {
                return '标记为已付';
            }             
            return 'marked as paid';
        } else 
        if(status == 3) {
            if(lang == 'zh') {
                return '支付确认';
            }              
            return 'payment confimed';
        } else 
        if(status == 4) {
            if(lang == 'zh') {
                return '支付失败';
            }              
            return 'failed';
        } else 
        if(status == 5) {
            if(lang == 'zh') {
                return '取消';
            }              
            return 'cancelled';
        }
        if(lang == 'zh') {
            return '未知';
        }          
        return 'unknown';                               
        // status: 1 - waiting for payment; 2 - marked as paid; 3 - payment confimed; 4- failed; 5 - cancelled;
    }    
}
