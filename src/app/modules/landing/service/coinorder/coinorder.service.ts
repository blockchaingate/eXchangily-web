import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class CoinOrderService {
    constructor (private http: HttpService) {}

    getAllOrders(token: string) {
        return this.http.get(environment.endpoints.blockchaingate + 'coinoders/all?token=' + token);
    }

    confirmOrder(token: string, id: string) {
        return this.http.get(environment.endpoints.blockchaingate + 'coinoders/' + id + '/confirm?token=' + token);
    }
}