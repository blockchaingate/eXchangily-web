import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class RewardService {
    constructor(private http: HttpClient) {
    }
    
    getPeriods() {
        const path = environment.endpoints.blockchaingate + 'tradereward/periods';
        const res = this.http.get(path);
        return res;
    }

    getRewards(period_id: string) {
        const path = environment.endpoints.blockchaingate + 'tradereward/period/' + period_id;
        const res = this.http.get(path);
        return res;
    }
}
