import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WalletService } from '../../../../services/wallet.service';

@Component({
    selector: 'app-create-wallet',
    templateUrl: './createwallet.component.html',
    styleUrls: ['./createwallet.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CreateWalletComponent implements OnInit {
    mnemonics: string[] = [];

    constructor(private route: Router, private walletServ: WalletService) {
    }

    // generate Mnemonics
    generateMnemonic() {
        
        if (!sessionStorage.mnemonic) {
            const mnemonic = this.walletServ.generateMnemonic();
            sessionStorage.mnemonic = mnemonic;
        }
        this.mnemonics.push(...(sessionStorage.mnemonic.split(' ', 12)));
        
       //this.mnemonics = ['trip', 'return', 'arrange', 'version', 'horn', 'mountain', 'trend', 'tissue', 'alter', 'rug', 'push', 'era'];
    }

    ngOnInit() {
        this.generateMnemonic();
    }

    /*
        change() {
            sessionStorage.removeItem('mnemonic');
            delete sessionStorage.mnemonic;
            this.generateMnemonic();
        }
    */
    
    next() {
        this.route.navigate(['/wallet/confirm-words']);
    }
}
