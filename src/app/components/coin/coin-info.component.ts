import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Coin } from '../../models/coin';
import { LanService } from 'src/app/services/lan.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-coininfo',
    templateUrl: './coin-info.component.html',
    styleUrls: ['./coin-info.component.css']
})
export class CoininfoComponent implements OnInit {
    @Input() width = 800;
    @Input() height = 480;
    @Input() coin: Coin;
    symbol = '';

    constructor(private _route: ActivatedRoute, private api: ApiService) { }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            this.symbol = params['symbol'];
            if (this.symbol) {
                this.getCoin(this.symbol);
            }
        });

    }

    getCoin(symbol: string) {
        this.api.getCoin(symbol.toLocaleUpperCase()).subscribe(ret => {
            this.coin = ret as Coin;
        });
    }

}
