import { Component, ViewChild, Input, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'locked-info-modal',
    templateUrl: './locked-info.modal.html',
    styleUrls: ['./locked-info.modal.scss']
})
export class LockedInfoModal implements OnInit{
    @ViewChild('lockedInfoModal', {static: true}) public lockedInfoModal: ModalDirective;
    coin: any;
    constructor() {

    }

    ngOnInit() {

    }

    show(coin) {
        console.log('coin=', coin);
        this.coin = coin;
        this.lockedInfoModal.show();
    }

    hide() {
        this.lockedInfoModal.hide();
    }

}