
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';

const path = 'currencies/';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(private http: HttpService) { }

  getAllCurrencies() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path);

    return this.http.get(path)
    .map((res: any) => {
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
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, updatePath);

    return this.http.get(updatePath)
    .map((res: any) => {
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
