import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    widget,
    IChartingLibraryWidget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
} from '../../../../../../assets/charting_library/charting_library.min';
import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockService} from '../../../../../services/mock.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { CoinService } from '../../../../../services/coin.service';

interface BarData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Component({
    selector: 'app-tv-chart-container',
    templateUrl: './tv-chart-container.component.html',
    styleUrls: ['./tv-chart-container.component.css']
})

export class TvChartContainerComponent implements OnInit, OnDestroy {
    @Input() baseCoin: number;
    @Input() targetCoin: number;  
    private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'AAPL';
    private _interval: ChartingLibraryWidgetOptions['interval'] = 'D';
    // BEWARE: no trailing slash is expected in feed URL
    private _datafeedUrl = 'https://demo_feed.tradingview.com';
    private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
    private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
    private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
    private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
    private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
    private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
    private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
    private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
    private _tvWidget: IChartingLibraryWidget | null = null;

    ws;
    wsMessage = 'you may need to send specific message to subscribe data, eg: BTC';
    socket: WebSocketSubject<BarData>;

    granularityMap = {
      '1': 60,
      '3': 180,
      '5': 300,
      '30': 30 * 60,
      '60': 60 * 60,
      '120': 60 * 60 * 2,
      '240': 60 * 60 * 4,
      '360': 60 * 60 * 6,
      'D': 86400,
      '1D': 86400
    };

    intervalMap = {
      '1': '1m',
      '3': '3m',
      '5': '5m',
      '30': '30m',
      '60': '1h',
      '120': '2h',
      '240': '4h',
      '360': '6h',
      'D': '1d',
      '1D': '1d'
    };    
    constructor(private mockService: MockService, private coinService: CoinService) {

    }

    @Input()
    set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
        this._symbol = symbol || this._symbol;
    }

    @Input()
    set interval(interval: ChartingLibraryWidgetOptions['interval']) {
        this._interval = interval || this._interval;
    }

    @Input()
    set datafeedUrl(datafeedUrl: string) {
        this._datafeedUrl = datafeedUrl || this._datafeedUrl;
    }

    @Input()
    set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
        this._libraryPath = libraryPath || this._libraryPath;
    }

    @Input()
    set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
        this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
    }

    @Input()
    set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
        this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
    }

    @Input()
    set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
        this._clientId = clientId || this._clientId;
    }

    @Input()
    set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
        this._userId = userId || this._userId;
    }

    @Input()
    set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
        this._fullscreen = fullscreen || this._fullscreen;
    }

    @Input()
    set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
        this._autosize = autosize || this._autosize;
    }

    @Input()
    set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
        this._containerId = containerId || this._containerId;
    }

    ngOnInit() {

      this.ws = this.mockService.fakeWebSocket();

      this.ws.onopen = () => {
        console.log('connect success');
      };

        function getLanguageFromURL(): LanguageCode | null {
            const regex = new RegExp('[\\?&]lang=([^&#]*)');
            const results = regex.exec(location.search);

            return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
        }
        const that = this;
        const datafeed = {
            onReady(x) {
                timer(0)
                  .pipe(
                    tap(() => {
                      x({
                        supported_resolutions: ['1', '3', '5', '30', '60', '120', '240', '360', 'D']
                      });
                    })
                  ).subscribe();
            }, 
            searchSymbols(userInput: string, exchange: string, symbolType: string, onResultReadyCallback) {
                onResultReadyCallback('haha');
            },
            async getBars(symbol, granularity, startTime, endTime, onResult, onError, isFirst) {
                console.log('symbol in getBars=', symbol);
                console.log('granularity=' + granularity);
                const list = await that.mockService.getHistoryList({
                  granularity: that.granularityMap[granularity],
                  interval: that.intervalMap[granularity],
                  startTime,
                  endTime
                });
                onResult(list);
            },
            resolveSymbol(symbol, onResolve) {
                console.log('symbol in resolveSymbol:', symbol);
                console.log('that.baseCoin=' + that.baseCoin);
                //const baseCoinName = that.coinService.getCoinNameByTypeId(that.baseCoin).toLowerCase();
                //const targetCoinName = that.coinService.getCoinNameByTypeId(that.targetCoin).toLowerCase();                  
                timer(1e3)
                  .pipe(
                    tap(() => {
                      onResolve({
                        name: 'ETH-BTC',
                        full_name: 'ETH', // display on the chart
                        base_name: 'BTC',
                        minmov: 1,
                        pricescale : 1000000,
                        volume_precision: 8,
                        has_intraday: true, // enable minute and others
                      });
                    })
                  ).subscribe();
            },
            getServerTime() {
                console.log('serverTime:', arguments);
            },
            subscribeBars(symbol, granularity, onTick) {
              const pair = 'ethbtc';
              this.socket = new WebSocketSubject('wss://stream.binance.com:9443/ws/' + pair + '@kline_' + that.intervalMap[granularity]);
              this.socket.subscribe(
                (item) => {
                  
                  const itemData = {
                    time: item.k.T,
                    open: item.k.o,
                    high: item.k.h,
                    low: item.k.l,
                    close: item.k.c,
                    volume: item.k.v
                  };
                  onTick(itemData);
                }
              );
              /*
                console.log('subscribe, arg:', arguments);
                that.ws.onmessage = (e) => {
                  console.log('e in subscribeBars:', e);
                  try {
                    const data = e;
                    if (data) {
                      // realtime data
                      // data's timestamp === recent one ? Update the recent one : A new timestamp data
                      // in this example mock service always returns a new timestamp(current time)
                      onTick(data);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                };
      
                // subscribe the realtime data
                that.ws.send(`${that.wsMessage}_kline_${that.granularityMap[granularity]}`);
                */
              },
            unsubscribeBars() {
              that.ws.send('stop receiving data or just close websocket');
              },                       
        };

        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: this._symbol,
            //datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
            datafeed: datafeed,
            interval: this._interval,
            container_id: this._containerId,
            library_path: this._libraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: this._chartsStorageUrl,
            charts_storage_api_version: this._chartsStorageApiVersion,
            client_id: this._clientId,
            user_id: this._userId,
            fullscreen: this._fullscreen,
            autosize: this._autosize,
        };

        const tvWidget = new widget(widgetOptions);
        this._tvWidget = tvWidget;

        tvWidget.onChartReady(() => {
            const button = tvWidget.createButton()
                .attr('title', 'Click to show a notification popup')
                .addClass('apply-common-tooltip')
                .on('click', () => tvWidget.showNoticeDialog({
                    title: 'Notification',
                    body: 'TradingView Charting Library API works correctly',
                    callback: () => {
                        console.log('Noticed!');
                    },
                }));

            button[0].innerHTML = 'Check API';
        });
    }

    ngOnDestroy() {
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
    }
}
