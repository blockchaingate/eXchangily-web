import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { WsService } from '../../../services/ws.service';
import { environment } from 'src/environments/environment.prod';
// import { OrderTicketFocusControl } from 'dist/dex/assets/charting_library/charting_library.min';

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

export class TvChartContainerComponent implements AfterViewInit, OnDestroy {

    private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'BTC/USDT';
    private _interval: ChartingLibraryWidgetOptions['interval'] = '1';
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

    wsMessage = 'you may need to send specific message to subscribe data, eg: BTC';
    socket: WebSocketSubject<BarData>;
    private sub: any;

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
    constructor(private mockService: MockService, private coinService: CoinService, 
      private _wsServ: WsService, private route: ActivatedRoute) {

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

    ngAfterViewInit() {
      const pair = this.route.snapshot.paramMap.get('pair');
      const pairArray = pair.split('_');
      this.loadChart(pairArray[1], pairArray[0]);

      /*
      this.sub = this.route.params.subscribe(params => {
        const pair = params['pair']; // (+) converts string 'id' to a number
        console.log('pair=' + pair);
        const pairArray = pair.split('_');
        this.loadChart(pairArray[0], pairArray[1]);
        // In a real app: dispatch action to load the details here.
     });
     */
    }

    loadChart(baseCoinName: string, targetCoinName: string) {
      console.log('loadChart once');

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
            getBars(symbol, granularity, startTime, endTime, onResult, onError, isFirst) {
                // console.log('symbol in getBars=', symbol);
                // console.log('granularity=' + granularity);

                console.log(that.mockService.gotHistoryList);
                if (that.mockService.gotHistoryList) {
                  console.log('already got');
                  return;
                }
                console.log('begin getBarsgetBarsgetBarsgetBarsgetBa');
                /*
                const pair = targetCoinName + baseCoinName;
                const list = await that.mockService.getHistoryList({
                  granularity: that.granularityMap[granularity],
                  interval: that.intervalMap[granularity],
                  startTime,
                  symbol: pair,
                  endTime
                });
                console.log('list===');
                console.log(list);
                */
               const pair = targetCoinName + baseCoinName;
               const param = {
                  granularity: that.granularityMap[granularity],
                  interval: that.intervalMap[granularity],
                  startTime,
                  symbol: pair,
                  endTime
                };

                that.mockService.getHistoryListSync(param).subscribe(
                  (res: any) => {
                    if (res && res.length > 0) {
                      for (let i = 0; i < res.length; i++) {
                        res[i].open = res[i].open / 1e18;
                        res[i].close = res[i].close / 1e18;
                        res[i].volume = res[i].volume / 1e18;
                        res[i].high = res[i].high / 1e18;
                        res[i].low = res[i].low / 1e18;
                        res[i].time = res[i].time * 1000;
                      }
                      onResult(res);
                    }                    
                  }                  
                );
               //const list = [];
               // onResult(list);
            },
            resolveSymbol(symbol, onResolve) {      
                timer(1e3)
                  .pipe(
                    tap(() => {
                      onResolve({
                        name:targetCoinName.toLowerCase() + baseCoinName.toLowerCase() ,
                        full_name: baseCoinName, // display on the chart
                        base_name: targetCoinName,
                        minmov: 1,
                        minmov2: 2,
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
              const pair = targetCoinName.toLowerCase() + baseCoinName.toLowerCase();
              console.log('subscribeBars once');
              
              /*
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
                  console.log('binance.time=', itemData.time);

                  console.log('binance.open=', itemData.open);
                  console.log('binance.high=', itemData.high);
                  console.log('binance.low=', itemData.low);
                  console.log('binance.close=', itemData.close);
                  console.log('binance.volume=', itemData.volume);                  
                  //onTick(itemData);
                }
              );
              */
                
             that.socket = new WebSocketSubject(environment.websockets.kline + '@' 
             + pair.toUpperCase() + '@' + that.intervalMap[granularity]);
             that.socket.subscribe(
               (item) => {
                 
                 const itemData = {
                   time: item.time * 1000,
                   open: item.open / 1e18,
                   high: item.high / 1e18,
                   low: item.low / 1e18,
                   close: item.close / 1e18,
                   volume: item.volume / 1e18
                 };

//                 console.log('price=', itemData.price);
                 console.log('time=', itemData.time);

                 console.log('open=', itemData.open);
                 console.log('high=', itemData.high);
                 console.log('low=', itemData.low);
                 console.log('close=', itemData.close);
                 console.log('volume=', itemData.volume);
                 if (item.time > 0) {
                  onTick(itemData);
                 }
                 
               }
             );            

              },
            unsubscribeBars() {
              if (that.socket) {
                that.socket.unsubscribe();
              }
              
              // that.ws.send('stop receiving data or just close websocket');
              },                       
        };

        const widgetOptions: ChartingLibraryWidgetOptions = { 
            symbol: this._symbol,
            //datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
            datafeed: datafeed,
            custom_css_url: '/assets/tradingview-custom.css',
            theme: 'Dark',
            interval: this._interval,
            container_id: this._containerId,
            library_path: this._libraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: [
              'use_localstorage_for_settings',
              'volume_force_overlay'
              /*
                    "header_widget", //头部工具sub
                    "left_toolbar", //左侧工具栏sub
                    "timeframes_toolbar",//底部工具栏
                    "edit_buttons_in_legend", //编辑按钮
                    "context_menus", //图表属性菜单
                    "display_market_status",//交易状态，是否休市
                    "control_bar", //控制图表工具栏（鼠标移至底部会出现）
                    "volume_force_overlay",//成交量和K线是否覆盖，禁用后成交量和K线会分离
                    'create_volume_indicator_by_default', // 默认创建Volumes指标              
              */
            ],
            // enabled_features: ['study_templates'],
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
          // tvWidget.chart().createStudy('ShuBenRSI', false, true);
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
      if (this.socket) {
        this.socket.unsubscribe();
      }
      
      // this.sub.unsubscribe();
      /*
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
        */
    }
}
