import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpService) {
  }

  getMe(token: string) {
    return this.http.get(environment.endpoints.blockchaingate + 'members/me?token=' + token);
  }
  importAllAddresses(token: string, exgAddress: string, btcAddress: string, ethAddress: string) {
    const data = {
      token: token,
      exgAddress: exgAddress,
      btcAddress: btcAddress,
      ethAddress: ethAddress
    }
    return this.http.post(environment.endpoints.blockchaingate + 'members/importAllAddresses', data);
  }
  getUserPaymentMethods(memberId) {
    return this.http.get(environment.endpoints.blockchaingate + 'userpaymentmethods/member/' + memberId);
  }
}