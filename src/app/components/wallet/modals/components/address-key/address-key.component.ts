import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UtilService } from '../../../../../services/util.service';
import { MyCoin } from '../../../../../models/mycoin';
import { CoinService } from '../../../../../services/coin.service';
import { Common } from '@ethereumjs/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-address-key',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatPaginatorModule, TranslateModule],
    templateUrl: './address-key.component.html',
    styleUrls: ['./address-key.component.css']
})
export class AddressKeyComponent implements OnInit, OnChanges {
    @Input() chain = -1;
    @Input() seed: Buffer = Buffer.alloc(0);
    addsArraylength = 0;
    @Input() currentCoin: MyCoin = {} as MyCoin;
    pageIndex = 0;
    pageSize = 10;
    addsPagination: any;
    // MatPaginator Output
    pageEvent: PageEvent = {} as PageEvent;

    constructor(private utilServ: UtilService, private coinServ: CoinService) { }

    ngOnInit() {
        this.showPage();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['currentCoin']) {
            this.showPage();
        }
    }

    copyPrivateKey(priKey: string) {
        this.utilServ.copy(priKey);
    }

    showPage() {
        const addsArray = (this.chain === 0) ? this.currentCoin.receiveAdds : this.currentCoin.changeAdds;
    
        if(!addsArray || addsArray.length < 1) {
            this.addsArraylength = 0;
            this.addsPagination = [];
            return;
        }
        this.addsArraylength = (addsArray.length < 1) ? (addsArray.length) : 1;
        this.addsPagination = addsArray.slice(0, 1);
        for (let i = 0; i < this.addsPagination.length; i++) {
            const keyPair = this.coinServ.getKeyPairs(this.currentCoin, this.seed, this.chain, this.addsPagination[i].index);
            this.addsPagination[i].privateKey = keyPair.privateKeyDisplay;
        }
    }

    pageChanged(event: any) {
        console.log(event);
        this.pageIndex = event.pageIndex;
        this.showPage();
    }
}
