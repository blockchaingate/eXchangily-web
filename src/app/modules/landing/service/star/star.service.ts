import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class StarService {
    constructor(private http: HttpService) { }

    getAllOrders(token: string) {
        return this.http.get(environment.endpoints.blockchaingate + '7star-order?token=' + token);
    }

    getPayments(orderId: string) {
        return this.http.get(environment.endpoints.blockchaingate + '7star-payment/order/' + orderId + '/all');
    }

    changeOrderStatus(id: string, status:number) {
        const url = environment.endpoints.blockchaingate + '7star-order/update';
        const body = {
           id: id,
           status: status
        }
        return this.http.post(url, body);
     }    
}