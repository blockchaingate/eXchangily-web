
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';
import { app } from '../modules/landing/app.constants';
import { Merchant } from '../models/merchant';

const path = environment.endpoints.blockchaingate + 'merchant/';

@Injectable()
export class MerchantService {
  private body: any = { app: app };
  
  constructor(private http: HttpService) {}

  // Create merchant
  create(merchant: Merchant) {
    const obj = Object.assign(this.body, merchant);
    return this.http.post(path + 'create', obj, true).pipe(map(res => <Merchant>res));
  }

  // Retrieve a merchant by its id.
  get(id: number | string) {
    return this.http.get(path + id, true).pipe(map(res => <Merchant>res));
  }

  // Get all
  getAll() {
    return this.http.get(path, true).pipe(map(res => <Merchant[]>res));
  }

  // Find multiple merchants
  find(mermberId) {
    return this.http.get(path + 'find/' + mermberId, true).pipe(map(res => <Merchant>res));
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
