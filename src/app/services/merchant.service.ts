import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';
import { app } from '../modules/landing/app.constants';
import { Merchant } from '../models/merchant';
import { MerchantModel } from '../models/merchant-model';

const path = environment.endpoints.blockchaingate + 'merchants/';

@Injectable()
export class MerchantService {
  private body: any = { app: app };

  constructor(private http: HttpService) { }

  // Create merchant
  create(token: string, merchant: MerchantModel) {
    return this.http.postPrivate(path + 'create', merchant, token);
  }

  createOtcMerchant(token: string, merchant: MerchantModel) {
    return this.http.postPrivate(environment.endpoints.blockchaingate + 'otc-merchant/' + 'create', merchant, token);
  }
  // Retrieve a merchant by its id.
  get(id: number | string) {
    return this.http.get(path + id, true).pipe(map(res => <Merchant>res));
  }

  // Get all
  getAll(token: string) {
    //return this.http.get(path + 'all', true).pipe(map(res => <Merchant[]>res));
    return this.http.getPrivate(path + 'all', token);
  }

  approve(id: string, token: string) {
    const url = path + 'approve/' + id;
    console.log('url==', url);
    return this.http.getPrivate(url, token);
  }
  // Find multiple merchants
  find(mermberId: string) {
    return this.http.get(path + 'find/' + mermberId, true).pipe(map(res => <Merchant[]>res));
  }

  // Update merchnat
  update(merchant: Merchant) {
    const obj = Object.assign(this.body, merchant);
    return this.http.post(path + 'update', obj, true).pipe(map(res => <Merchant>res));
  }

  // Delete merchant
  delete(id: string) {
    const data = { id: id };
    const obj = Object.assign(this.body, data);
    return this.http.post(path + 'delete', obj, true).pipe(map(res => <Merchant>res));
  }
}
