import { CommonModule } from '@angular/common';
import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'locked-info-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, TranslateModule],
    templateUrl: './locked-info.modal.html',
    styleUrls: ['./locked-info.modal.scss']
})
export class LockedInfoModal implements OnInit {
    @ViewChild('lockedInfoModal', { static: true }) public lockedInfoModal: ModalDirective = {} as ModalDirective;
    coin: any;

    constructor() {
    }

    ngOnInit() {

    }

    show(coin: any) {
        console.log('coin=', coin);
        this.coin = coin;
        this.lockedInfoModal.show();
    }

    hide() {
        this.lockedInfoModal.hide();
    }

}