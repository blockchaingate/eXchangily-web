import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import { environment } from '../../environments/environment';
@Injectable()
export class CoinOrderService {
    constructor(private httpServ: HttpService) {
    } 

    addOrder(data: any) {
        return this.httpServ.post(environment.endpoints.blockchaingate + 'coinoders/create', data);
    }

    getOrders(token: string) {
        return this.httpServ.get(environment.endpoints.blockchaingate + 'coinoders?token=' + token);
    }
}
