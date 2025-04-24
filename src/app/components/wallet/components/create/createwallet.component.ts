import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../../../services/wallet.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MnemonicComponent } from '../mnemonic/mnemonic.component';

@Component({
    selector: 'app-create-wallet',
    standalone: true,
    imports: [CommonModule, MnemonicComponent, TranslateModule],
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
        // if (!sessionStorage.mnemonic) {
        const mnemonic = this.walletServ.generateMnemonic();
        sessionStorage['mnemonic'] = mnemonic;
        // }
        this.mnemonics.push(...(sessionStorage['mnemonic'].split(' ', 12)));
        
        // this.mnemonics = ['trip', 'return', 'arrange', 'version', 'horn', 'mountain', 'trend', 'tissue', 'alter', 'rug', 'push', 'era'];
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
