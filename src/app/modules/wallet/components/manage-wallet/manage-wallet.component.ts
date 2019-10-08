import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-manage-wallet',
    templateUrl: './manage-wallet.component.html',
    styleUrls: ['./manage-wallet.component.css']
})
export class ManageWalletComponent implements OnInit {
    @Output() manageWallet = new EventEmitter<string>();
    constructor () {

    }
    manageWal(type: string) {
        console.log('type=' + type);
        this.manageWallet.emit(type);
    }
    ngOnInit() {

    }
}
