import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Coin } from '../../models/coin';
import { LanService } from '../../services/lan.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-coininfo',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './coin-info.component.html',
    styleUrls: ['./coin-info.component.css']
})
export class CoininfoComponent implements OnInit {
    @Input() width = 800;
    @Input() height = 480;
    @Input() coin: Coin = {} as Coin;
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
        /*
        this.api.getCoin(symbol.toLocaleUpperCase()).subscribe(ret => {
            this.coin = ret as Coin;
        });
        */
    }

}
