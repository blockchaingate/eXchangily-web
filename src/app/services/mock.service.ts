import { Injectable } from '@angular/core';
import { Observable, Observer, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BTC_PRICE_LIST } from '../components/mock/btc-181123_2006-181124_0105';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface BarData {
  time: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockService {
  // static dataTemplate: BarData = { 'time': 1545572340000, 'open': 3917, 'high': 3917, 'low': 3912.03, 'close': 3912.62, 'volume': 3896 };
  static dataIndex = 0;
  static dataLength = BTC_PRICE_LIST.length;
  gotHistoryList: boolean;

  lastBarTimestamp: number;

  static dataGenerator(time = +new Date()): BarData {
    const obj: any = {};
    Object.assign(obj, BTC_PRICE_LIST[this.dataIndex], { time });
    ++this.dataIndex >= this.dataLength && (this.dataIndex = 0);
    return obj;
  }

  constructor(private http: HttpClient) {
    this.gotHistoryList = false;
  }


  getHistoryListSync(param) {
    this.gotHistoryList = true;
    const inter = param.interval;
    const symbol = param.symbol;
    const url = environment.endpoints.kanban + 'v2/klinedata/' + symbol + '/' + inter;
    return this.http.get(url);    
  }
  async getHistoryList(param): Promise<BarData[]> {
    //console.log('getting history');

    const list = [];
    const inter = param.interval;
    const symbol = param.symbol;
    //console.log('interval=' + interval);
    /*
    let timePoint = +new Date(param.startTime * 1e3).setSeconds(0, 0);
    const now = +new Date();
    while (timePoint < now) {
      this.lastBarTimestamp = timePoint;
      list.push(MockService.dataGenerator(timePoint));
      timePoint += param.granularity * 1e3;
    }
    console.log(list[list.length - 1]);
    */
    // intervals array('1h','30m','15m','5m', '1m')
    const url = environment.endpoints.kanban + 'klinedata/' + symbol + '/' + inter;

    // console.log('url for getHistoryList=', url);
    const res = await this.http.get(url).toPromise() as [BarData];
    if (res && res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        res[i].open = res[i].open / 1e18;
        res[i].close = res[i].close / 1e18;
        res[i].volume = res[i].volume / 1e18;
        res[i].high = res[i].high / 1e18;
        res[i].low = res[i].low / 1e18;
        res[i].time = res[i].time * 1000;
      }
    }
    this.gotHistoryList = true;
    return res;
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
