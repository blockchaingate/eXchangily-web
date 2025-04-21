import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';
import { app } from '../modules/landing/app.constants';

const path = environment.endpoints.blockchaingate;

@Injectable()
export class OtcService {
  private body: any = { app: app };

  constructor(private http: HttpService) { }

  addListing(token: string, data: any) {
    return this.http.postPrivate(path + 'otc-listing/create', data, token);
  }

  changePaymentStatus(token: string, order_id: string, paymentStatus: string) {
    const data = {
      paymentStatus: paymentStatus
    };
    return this.http.postPrivate(path + 'orders/' + order_id + '/changePaymentStatus', data, token);
  }

  updateOrderAddress(token: string, order_id: string, address: string) {
    const data = {
      address: address
    };
    return this.http.postPrivate(path + 'orders/' + order_id + '/updateAddress', data, token);
  }

  changePaymentMethod(token: string, order_id: string, method: string) {

    return this.http.getPrivate(path + 'orders/' + order_id + '/changePaymentMethod/' + method, token);
  }

  addOrder(token: string, listing_id: string, data: any) {
    return this.http.postPrivate(path + 'otc-listing/' + listing_id + '/add-order', data, token);
  }

  getListings(token: string) {
    return this.http.getPrivate(path + 'otc-listing/private/list', token);
  }

  getOrders(token: string) {
    return this.http.getPrivate(path + 'orders/private/member-orders', token);
  }

  getOrder(id: string) {
    return this.http.get(path + 'orders/public/' + id, false);
  }

  getAllOrders(token: string) {
    return this.http.getPrivate(path + 'orders/admin/otc-orders', token);
  }

  getMerchantOrders(token: string) {
    return this.http.getPrivate(path + 'orders/private/merchant-orders', token);
  }

  getPublicListings() {
    return this.http.get(path + 'otc-listing/public/list');
  }

  getAllListings(token: string) {
    return this.http.getPrivate(path + 'otc-listing/admin/list', token);
  }

  setActive(listing_id: string, status: boolean, token: string) {
    const data = {
      id: listing_id,
      active: status
    };

    return this.http.postPrivate(path + 'otc-listing/admin/active', data, token);
  }
}