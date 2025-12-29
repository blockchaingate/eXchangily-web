
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-wallet',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletComponent {
    constructor(private route: Router) {
    }
}
