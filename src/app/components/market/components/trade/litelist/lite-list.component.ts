import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price } from '../../../../../models/kanban.interface';
import { PriceService } from '../../../../../services/price.service';
import { WsService } from '../../../../../services/ws.service';
import { UtilService } from '../../../../../services/util.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CallbackPipe } from '../../../../shared/pipes/callback.pipe';
import { SortByFieldPipe } from '../../../../shared/pipes/sort.pipe';

export interface Section {
    name: string;
    updated: Date;
}

@Component({
    selector: 'app-lite-list',
    standalone: true,
    imports: [CommonModule, MatListModule, FormsModule, CallbackPipe, SortByFieldPipe, TranslateModule],
    templateUrl: './lite-list.component.html',
    styleUrls: ['./lite-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LiteListComponent implements OnInit {
    selectedcat: any = 'DUSD';
    selectedpair: any = 'FAB/DUSD';
    pdecimal = '1.2-2';
    vdecimal = '1.6-6';
    // pairConfig: Pair = { name: 'BTCUSDT', priceDecimal: 2, qtyDecimal: 6 };
    errMsg = '';

    prices: Price[] = [];
    searchText = '';

    sortField = '';
    sortFieldType = '';
    sortAsc = false;
    sortAscPair = 0;
    sortAscPrice = 0;
    sortAscChange = 0;

    // socket: WebSocketSubject<[Ticker]>;
    constructor(private prServ: PriceService, public utilServ: UtilService, private _route: ActivatedRoute,
        private _router: Router, private _wsServ: WsService, private zone: NgZone, private cdr: ChangeDetectorRef) {
    }

    changeSort(field: string, fieldType: string) {
        this.sortField = field;
        this.sortFieldType = fieldType;
        if (field === 'symbol') {
            if (!this.sortAscPair) {
                this.sortAscPair = 1;
            } else {
                this.sortAscPair = -this.sortAscPair;
            }
            if (this.sortAscPair === 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field === 'price') {
            if (!this.sortAscPrice) {
                this.sortAscPrice = 1;
            } else {
                this.sortAscPrice = -this.sortAscPrice;
            }
            if (this.sortAscPrice === 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        } else if (field === 'change24h') {
            if (!this.sortAscChange) {
                this.sortAscChange = 1;
            } else {
                this.sortAscChange = -this.sortAscChange;
            }
            if (this.sortAscChange === 1) {
                this.sortAsc = true;
            } else {
                this.sortAsc = false;
            }
        }

    }

    filterPrice(price: Price, selectedcat: string, searchText: string) {
        // console.log('this.select=', select);
        if (searchText && searchText.trim() !== '') {
            return price.symbol.indexOf(searchText.toUpperCase()) >= 0;
        }
        return price.symbol.indexOf(selectedcat) >= 0;
    }

    toDecimal(amount: number, decimal: number) {
        if(amount) {
            return amount.toFixed(decimal);
        }
        return 0;
    }

    formatSymbol(symbol: string) {
        const symbolArr = symbol.split('_');
        const targetCoin = symbolArr[0];
        const baseCoin = symbolArr[1];
        return targetCoin + '/' + baseCoin;
    }

    ngOnInit() {

        this.sortField = '';
        this.sortFieldType = '';
        this.sortAsc = true;
        this.sortAscPair = 0;
        this.sortAscPrice = 0;
        this.sortAscChange = 0;

        this.selectedcat = sessionStorage.getItem('tradeCat');
        if (!this.selectedcat) {
            this.selectedcat = 'USDT';
        }
        this.selectedpair = sessionStorage.getItem('tradePair');
        if (!this.selectedpair) {
            this.selectedpair = 'BTC/USDT';
        }

        this.applyRoutePair(this._route.snapshot.paramMap.get('pair'));
        this._route.params.subscribe(params => {
            this.applyRoutePair(params['pair']);
        });

        this.prServ.getPriceList(100, 0).subscribe(
            (ret: any) => {
                const data = (ret && ret.success && ret.data) ? ret.data
                    : Array.isArray(ret) ? ret
                    : (ret && Array.isArray(ret.data) ? ret.data : []);

                // Defer initial assignment to avoid NG0100 during first CD pass
                setTimeout(() => {
                    this.prices = data.map((p: any) => ({
                        ...p,
                        price: p.price ?? 0,
                        change24h: p.change24h ?? 0,
                        vol24h: p.vol24h ?? 0
                    }));
                    this.cdr.markForCheck();
                }, 0);
            }
        );
        this.zone.runOutsideAngular(() => {
            this._wsServ.currentPrices.subscribe((tickers: any) => {
                // Defer updates to avoid ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.zone.run(() => {
                        if (!Array.isArray(tickers) || this.prices.length === 0) {
                            return;
                        }
                        const tickerMap = new Map<string, any>();
                        for (const t of tickers) {
                            if (t && t.s) {
                                tickerMap.set(t.s, t);
                            }
                        }

                        const nextPrices = this.prices.map((p) => {
                            const t = tickerMap.get(p.symbol);
                            if (!t) {
                                return p;
                            }
                            const price = Number(t.c);
                            const open = Number(t['o']);
                            const close = Number(t['c']);
                            const change24h = open > 0 ? (close - open) / open * 100 : 0;
                            const vol24h = Number(t['v']);
                            return {
                                ...p,
                                price,
                                change24h: Number(change24h.toFixed(2)),
                                vol24h
                            };
                        });

                        this.prices = nextPrices;
                        this.cdr.markForCheck();
                    });
                }, 0);
            });
        });
    }

    private applyRoutePair(routePair: string | null) {
        if (!routePair) {
            return;
        }
        const pairArr = routePair.split('_');
        if (pairArr.length !== 2) {
            return;
        }
        this.selectedpair = pairArr[0] + '/' + pairArr[1];
        this.selectedcat = pairArr[1];
        sessionStorage.setItem('tradePair', this.selectedpair);
        sessionStorage.setItem('tradeCat', this.selectedcat);
        this.cdr.markForCheck();
    }

    setSelect() {
        if (this.searchText) {
            this.selectedpair = this.searchText.toUpperCase();
        }
    }

    selectCat(cat: string) {
        this.selectedcat = cat;
        sessionStorage.setItem('tradeCat', cat);
    }

    loadTradePair(pair: string) {
        this.selectedpair = pair;
        sessionStorage.setItem('tradePair', pair);
        pair = pair.replace('/', '_');
        /*
            this._router.navigateByUrl('/OrderPadComponent', { skipLocationChange: true }).then(() => {
                this._router.navigate(['market/trade/' + pair]);
            });
        */
        this._router.navigate(['market/trade/' + pair]);
    }

}
