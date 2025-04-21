import {Component, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-no-wallet',
    templateUrl: './no-wallet.component.html',
    styleUrls: ['./no-wallet.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NoWalletComponent {
    title = 'Wallet';

    networkLoaded = false;
    translationLoaded = false;

    constructor(private route: Router) {
    }

    // Create Wallet
    createWallet() {
      this.route.navigate(['/wallet/create']);
    }

    restoreWallet() {
      this.route.navigate(['/wallet/restore']);
    }
}
