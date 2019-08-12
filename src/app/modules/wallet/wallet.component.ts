import {Component, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletComponent {
    constructor(private route: Router) {
    }
}
