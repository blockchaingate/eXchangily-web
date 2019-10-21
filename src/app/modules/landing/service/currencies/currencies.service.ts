
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { map } from 'rxjs/operators/map';
import { environment } from '../../../../../environments/environment';

const path = environment.endpoints.blockchaingate + 'currencies/';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(private http: HttpService) { }

  getAllCurrencies() {
    return this.http.get(path).pipe(map(res => res));
  }

  convertToEXC(price: number, currency: string, reverse: boolean = false, applyDiscount: boolean = false) {
    if (currency.toLowerCase() === 'rmb') {
      currency = 'CNY';
    }
    const updatePath = path + 'convertToEXC/' + price + '/' + currency + '/' + reverse + '/' + applyDiscount;
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, updatePath);

    return this.http.get(updatePath, true).pipe(map(res => res));
  }
}
