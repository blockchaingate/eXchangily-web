import { Injectable } from '@angular/core';
import { Observable, Observer, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BTC_PRICE_LIST } from '../components/mock/btc-181123_2006-181124_0105';
import { HttpClient } from '@angular/common/http';

interface BarData {
  time: number;
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
  static dataTemplate: BarData = { 'time': 1545572340000, 'open': 3917, 'high': 3917, 'low': 3912.03, 'close': 3912.62, 'volume': 3896 };
  static dataIndex = 0;
  static dataLength = BTC_PRICE_LIST.length;

  lastBarTimestamp: number;

  static dataGenerator(time = +new Date()): BarData {
    const obj: any = {};
    Object.assign(obj, BTC_PRICE_LIST[this.dataIndex], { time });
    ++this.dataIndex >= this.dataLength && (this.dataIndex = 0);
    return obj;
  }

  constructor(private http: HttpClient) {
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
    const res = await this.http.get('http://localhost:3004/klines?symbol=' + symbol + '&interval=' + inter).toPromise() as string;

      const resp = Array.from(res.toString());
      for (let i = 0; i < resp.length; i++) {
        const item = res[i];
        if (!item) {
          continue;
        }
        const itemArray = Array.from(item);
        const openTime = itemArray[0];
        const open = itemArray[1];
        const high = itemArray[2];
        const low = itemArray[3];
        const close = itemArray[4];
        const volume = itemArray[5];
        const closeTime = itemArray[6];
        const quoteAssetVolume = itemArray[7];
        const numberOfTrades = itemArray[8];
        const takerBuyBaseAssetVolume = itemArray[9];
        const takerBuyQuoteAssetVolume = itemArray[10];
        const ignore = itemArray[11];
        const barItem = {time: closeTime, open: open, high: high, low: low, close: close, volume: volume};
        list.push(barItem);
        //console.log('openTime=' + openTime);
        //console.log('ignore=' + ignore);
      }

    return list;
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
