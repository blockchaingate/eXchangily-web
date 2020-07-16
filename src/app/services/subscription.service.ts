import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class SubscriptionService {
    constructor(private http: HttpClient) { }

    create(email: string, name: string) {
        const url = environment.endpoints.blockchaingate + 'subscription/create/';
        const data = { email: email, name: name };

        return this.http.post(url, data);
    }
}
