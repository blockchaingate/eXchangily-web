import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UtilService } from 'src/app/services/util.service';
import { MyCoin } from '../../../../../models/mycoin';
import { CoinService } from '../../../../../services/coin.service';
@Component({
    selector: 'app-address-key',
    templateUrl: './address-key.component.html',
    styleUrls: ['./address-key.component.css']
})
export class AddressKeyComponent implements OnInit, OnChanges {
    @Input() chain: number;
    @Input() seed: Buffer;
    addsArraylength: number;
    @Input() currentCoin: MyCoin;
    pageIndex = 0;
    pageSize = 10;
    addsPagination: any;
    // MatPaginator Output
    pageEvent: PageEvent;

    constructor(
        private utilServ: UtilService,
        private coinServ: CoinService) { }

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
        this.addsArraylength = (addsArray.length < 1) ? (addsArray.length) : 1;
        this.addsPagination = addsArray.slice(0, 1);
        for (let i = 0; i < this.addsPagination.length; i++) {
            const keyPair = this.coinServ.getKeyPairs(this.currentCoin, this.seed, this.chain, this.addsPagination[i].index);
            this.addsPagination[i].privateKey = keyPair.privateKeyDisplay;
        }
    }

    pageChanged(event) {
        console.log(event);
        this.pageIndex = event.pageIndex;
        this.showPage();
    }
}
