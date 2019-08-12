import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { price_list, coin_list } from '../config/coins';



@Injectable()
export class PriceService {
  constructor(private http: HttpClient) {
  }

  getPriceList() {
    return price_list;
  }

  getCoinList() {
    return coin_list;
  }  
}
