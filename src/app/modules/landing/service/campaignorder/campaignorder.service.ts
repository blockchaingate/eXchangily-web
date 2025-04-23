import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class CampaignOrderService {
    constructor(private http: HttpService) { }

    getAllOrders(token: string) {
        return this.http.get(environment.endpoints.blockchaingate + 'campaign-order/all?token=' + token);
    }

    confirmOrder(token: string, id: string) {
        return this.http.get(environment.endpoints.blockchaingate + 'campaign-order/' + id + '/confirm?token=' + token);
    }

    getStatusText(status: number) {
        if (status === 1) {
            return 'waiting for payment';
        } else if (status === 2) {
            return 'marked as paid';
        } else if (status === 3) {
            return 'payment confimed';
        } else if (status === 4) {
            return 'failed';
        } else if (status === 5) {
            return 'cancelled';
        }
        return 'unknown';
        // status: 1 - waiting for payment; 2 - marked as paid; 3 - payment confimed; 4- failed; 5 - cancelled;
    }
    //
}