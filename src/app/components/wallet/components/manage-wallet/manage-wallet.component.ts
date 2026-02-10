
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-manage-wallet',
    standalone: true,
    imports: [TranslateModule],
    templateUrl: './manage-wallet.component.html',
    styleUrls: ['./manage-wallet.component.css']
})
export class ManageWalletComponent implements OnInit {
    @Input() hideWallet = false;
    @Output() manageWallet = new EventEmitter<string>();

    constructor() {
    }

    manageWal(type: string) {
        this.manageWallet.emit(type);
    }

    hideShowWallet() {
        this.manageWal('HIDE_SHOW_WALLET');
    }

    changeHideWallet() {
        this.hideWallet = !this.hideWallet;
    }

    ngOnInit() {
    }
}
