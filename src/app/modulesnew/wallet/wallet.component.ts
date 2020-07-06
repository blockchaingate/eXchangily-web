import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
selector: 'app-new-wallet',
templateUrl: './wallet.component.html',
styleUrls: ['./wallet.component.scss'],
encapsulation: ViewEncapsulation.None
})
export class WalletComponent {
constructor(private route: Router) {
    }
}
