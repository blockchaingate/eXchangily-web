import { Injectable } from '@angular/core';
import { Observable, Observer, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BTC_PRICE_LIST } from '../components/mock/btc-181123_2006-181124_0105';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface BarData {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockService {
  // static dataTemplate: BarData = { 'time': 1545572340000, 'open': 3917, 'high': 3917, 'low': 3912.03, 'close': 3912.62, 'volume': 3896 };
  static dataIndex = 0;
  static dataLength = BTC_PRICE_LIST.length;
  gotHistoryList: boolean;

  lastBarTimestamp = 0;

  static dataGenerator(time = +new Date()): BarData {
    const obj: any = {};
    Object.assign(obj, BTC_PRICE_LIST[this.dataIndex], { time });
    ++this.dataIndex >= this.dataLength && (this.dataIndex = 0);
    return obj;
  }

  constructor(private http: HttpClient) {
    this.gotHistoryList = false;
  }


  getHistoryListSync(param: any): Observable<any> {
    this.gotHistoryList = true;
    const inter = param.interval;
    const symbol = param.symbol;
    const url = environment.endpoints.api + 'v3/exchangily/pair/' + symbol + '/klinedata/' + inter;
    return this.http.get(url);
  }

  fakeWebSocket() {
    let granularity: number;
    let subscription: Subscription;

    const ws: any = {
      send(message: string) {
        const matched = message.match(/.+_kline_(\d+)/);

        // if matched, then send data base on granularity, else unsubscribe.
        if (matched) {
          granularity = +matched[1] * 1e3;
          sendData();
        } else {
          //subscription.unsubscribe();
        }
      },
      close() {
      }
    };

    const sendData = () => {
      const duration = 3e3;
      subscription = interval(duration)
        .pipe(
          map(() => {
            const currentTimestamp = +new Date();
            if (currentTimestamp - this.lastBarTimestamp >= granularity) {
              this.lastBarTimestamp += granularity;
            }
            return MockService.dataGenerator(this.lastBarTimestamp);
          })
        )
        .subscribe(x => {
          ws.onmessage && ws.onmessage(x);
        });
    };

    // simulate open websocket after one second
    setTimeout(() => {
      ws.onopen();
    }, 1e3);

    return ws;
  }
}
