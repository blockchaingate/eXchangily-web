import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mnemonic',
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
