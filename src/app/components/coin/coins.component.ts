import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Coin } from '../../models/coin';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-coininfo',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit {
    coins: Coin[] = [];
    selected = 0;
    errMsg = '';

    constructor(private _router: Router, private api: ApiService) { }

    ngOnInit(): void {
        this.getCoins();
    }

    getCoins() {
        this.api.getAllCoins().then(ret => {
            this.coins = ret as Coin[];
        },
        err => {this.errMsg = err['message']; });
    }

    onSelect(i: number) {
        const symbol = this.coins[i].symbol;
        this._router.navigate(['/assets/' + symbol]);
    }
}
