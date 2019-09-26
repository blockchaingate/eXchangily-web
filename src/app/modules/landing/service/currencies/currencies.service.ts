
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { HttpHelperService } from '../http-helper/http-helper.service';
import { Observable } from 'rxjs/Observable';
import { app } from '../../app.constants';

const path = 'currencies/';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(private http: Http, private httpHelper: HttpHelperService) { }

  getAllCurrencies() {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.handleSuccess(retJson);
    })
    .catch(this.handleError);
  }

  convertToEXC(price: number, currency: string, reverse: boolean = false, applyDiscount: boolean = false) {
    if (currency.toLowerCase() === 'rmb') {
      currency = 'CNY';
    }
    const updatePath = path + 'convertToEXC/' + price + '/' + currency + '/' + reverse + '/' + applyDiscount;
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, updatePath);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.handleSuccess(retJson);
    })
    .catch(this.handleError);
  }

  private handleSuccess(res) {
    return res;
  }

  private handleError(error) {
    return observableThrowError(error);
  }
}
