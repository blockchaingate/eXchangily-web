import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mnemedit',
    templateUrl: './mnemedit.component.html',
    styleUrls: ['./mnemonic.component.css']
})
export class MnemeditComponent {
    @Input() mnemonics: string[] = [];

    word1 = '';
    word2 = '';
    word3 = '';
    word4 = '';
    word5 = '';
    word6 = '';
    word7 = '';
    word8 = '';
    word9 = '';
    word10 = '';
    word11 = '';
    word12 = '';
    clicked = false;

    constructor(private route: Router, private locat: Location) {
    }

    sanitize(word: string) {
        // convert to lowercase from upper case if any
        // remove any unwated space and/or characters
        const p = String(word).toLowerCase();
        p.replace(/\s+/g, '');
        let q = '';

        for (let i = 0; i < p.length; i++) {
            if (p[i].match(/[a-z]/i)) {
                q += p[i];
            }
        }

        return q;
    }

    confirm() {
        const mnem = this.sanitize(this.word1) + ' ' + this.sanitize(this.word2) + ' ' + this.sanitize(this.word3) + ' '
            + this.sanitize(this.word4) + ' ' + this.sanitize(this.word5) + ' ' + this.sanitize(this.word6) + ' '
            + this.sanitize(this.word7) + ' ' + this.sanitize(this.word8) + ' ' + this.sanitize(this.word9) + ' '
            + this.sanitize(this.word10) + ' ' + this.sanitize(this.word11) + ' ' + this.sanitize(this.word12);

        if (mnem === sessionStorage.mnemonic) {
            this.route.navigate(['/wallet/set-password']);           
        } else {
            this.clicked = true;
        }
    }

    back() {
        this.locat.back();
    }
}
