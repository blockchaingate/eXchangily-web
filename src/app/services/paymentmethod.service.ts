import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class PaymentMethodService {
  constructor(private http: HttpService) {
  }

  addPaymentmethod(token: string, name: string) {
    const data = {
      name: name
    }
    return this.http.postPrivate(environment.endpoints.blockchaingate + 'paymentmethods/create', data, token);
  }

  addUserPaymentmethod(token: string, data: any) {
    return this.http.postPrivate(environment.endpoints.blockchaingate + 'userpaymentmethods/create', data, token);
  }

  updateUserPaymentmethod(token: string, userpaymentmethod_id: string, data: any) {
    return this.http.postPrivate(environment.endpoints.blockchaingate + 'userpaymentmethods/' + userpaymentmethod_id + '/update', data, token);
  }

  deleteUserPaymentmethod(token: string, id: string) {
    return this.http.getPrivate(environment.endpoints.blockchaingate + 'userpaymentmethods/' + id + '/delete', token);
  }

  deletePaymentmethod(token: string, id: string) {
    return this.http.getPrivate(environment.endpoints.blockchaingate + 'paymentmethods/' + id + '/delete', token);
  }

  getPaymentMethods() {
    return this.http.get(environment.endpoints.blockchaingate + 'paymentmethods');
  }

  getUserPaymentMethods(token: string) {
    return this.http.getPrivate(environment.endpoints.blockchaingate + 'userpaymentmethods/owned', token);
  }

  getUserPaymentMethodsByMemberId(memberId: string) {
    return this.http.getRaw(environment.endpoints.blockchaingate + 'userpaymentmethods/member/' + memberId);
  }
}