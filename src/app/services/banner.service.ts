import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

constructor(private httpServ: HttpService) { }
  getMarketBanner() {
    return this.httpServ.get(
      // environment.endpoints.blockchaingate + '/v2/banners/app/5b6a8688905612106e976a69'
      'https://api.blockchaingate.com/v2/banners/app/5b6a8688905612106e976a69'
      );
  }
}
