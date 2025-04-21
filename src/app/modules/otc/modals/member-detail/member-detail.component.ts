import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'otc-member-detail-modal',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailModal implements OnInit {
    member: any;
    userpaymentmethods: any;
    coin = '';
    bidOrAsk = false;

    @ViewChild('memberDetailModal', { static: true }) public memberDetailModal: ModalDirective = {} as ModalDirective;

    constructor(
    ) { }

    ngOnInit() {
    }

    show(bidOrAsk: boolean, coin: string, member: any, userpaymentmethods: any) {
        console.log('member=', member);
        this.bidOrAsk = bidOrAsk;
        this.coin = coin;
        this.member = member;
        this.userpaymentmethods = userpaymentmethods;
        this.memberDetailModal.show();
    }
    hide() {
        this.memberDetailModal.hide();
    }

    getAddress() {
        if (this.coin == 'USDT' || this.coin == 'ETH') {
            return this.member.walletEthAddress;
        } else if (this.coin == 'BTC') {
            return this.member.walletBtcAddress;
        } else if (this.coin == 'FAB' || this.coin == 'DUSD' || this.coin == 'EXG') {
            return this.member.walletExgAddress;
        }
        return '';
    }
}