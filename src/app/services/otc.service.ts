
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';
import { app } from '../modules/landing/app.constants';

const path = environment.endpoints.blockchaingate;

@Injectable()
export class OtcService {
  private body: any = { app: app };
  
  constructor(private http: HttpService) {}

  addListing(token: string, data) {
    return this.http.postPrivate(path + 'otc-listing/create', data, token);
  }
  
  getListings(token: string) {
    return this.http.getPrivate(path + 'otc-listing/private/list', token);
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