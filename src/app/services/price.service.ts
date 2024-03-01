import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { price_list, coin_list } from '../config/coins';
import { environment } from 'src/environments/environment';

@Injectable()
export class PriceService {
  constructor(private http: HttpClient) {
  }

  getPriceList(pageSize:number, pageNum: number) {
    const url = environment.endpoints.api + 'v3/exchangily/pair/withPrice/' + pageSize + '/' + pageNum;
    console.log('url for getPriceList===', url);
    return this.http.get(url);
  }

  getCoinList() {
    return coin_list;
  }  
}
