import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-mnemonic',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './mnemonic.component.html',
    styleUrls: ['./mnemonic.component.css']
})
export class MnemonicComponent {
    @Input() mnemonics: string[] = [];

    constructor(private route: Router) {
    }

    next() {
        this.route.navigate(['/wallet/confirm-words']);
    }
}
