import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class KycService {
    constructor(private http: HttpClient) {
    }
    userAdd(data: any) {
        const url = environment.endpoints.otc_api + 'user/register/wallet';
        return this.http.post(url, data);
    }

    login(data: any) {
        const url = environment.endpoints.otc_api + 'user/login';
        return this.http.post(url, data);
    }

    getByWalletAddress(walletAddress: string) {
        const url = environment.endpoints.otc_api + 'kyc/wallet_address/' + walletAddress;
        return this.http.get(url);
    }
}