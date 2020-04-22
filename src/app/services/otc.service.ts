
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
  
}