import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../../../../services/wallet.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Wallet } from '../../../../models/wallet';

@Component({
    selector: 'app-restore-wallet',
    templateUrl: './restorewallet.component.html',
    styleUrls: ['./restorewallet.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RestoreWalletComponent implements OnInit {
    userForm: FormGroup;
    seedPhrase: string;
    seedPhraseInvalid: boolean;

    constructor(private route: Router, private fb: FormBuilder, private walletServ: WalletService, private localSt: LocalStorage) {
    }

    ngOnInit() {
      this.seedPhraseInvalid = false;
      this.userForm = this.fb.group({
          type: [null, [Validators.required]],
          name: [null, [
              Validators.required,
              Validators.pattern(/^[A-z0-9]*$/),
              Validators.minLength(2)]
          ],
          password: [null, [
              Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`\(\)!@#\$%\^&\*])(?=.{8,})/)]
          ],
          pwdconfirm: [''],
          seedphrase: [null, [Validators.required]]
      }, { validator: this.checkPasswords });
    }    

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.pwdconfirm.value;
        if (pass !== confirmPass) {
          return { notSame: true };
        }

        return null;
    }   
    
    autoGrow(seedPhrase: string) {
      this.seedPhrase = seedPhrase.trim().replace(/\s\s+/g, ' ').replace(/(\r\n|\n|\r)/gm, '');
      if (!this.walletServ.validateMnemonic(this.seedPhrase)) {
        this.seedPhraseInvalid = true;
      } else {
        this.seedPhraseInvalid = false;
      }
    }
    onSubmit() {
      const name = this.userForm.controls.name.value;
      const pwd = this.userForm.controls.password.value;
      const mnemonic = this.seedPhrase;

      const wallet = this.walletServ.generateWallet(pwd, name, mnemonic);

      
      if (!wallet) {
          alert('Error occured, please try again.');
      } else {
          this.localSt.getItem('wallets').subscribe((wallets: Wallet[]) => {
              if (!wallets) {
                  wallets = [];
              }
              if (wallets.indexOf(wallet) < 0) {
                  wallets.push(wallet);
                  
              }
              this.walletServ.saveCurrentWalletIndex(wallets.length - 1);
              this.localSt.setItem('wallets', wallets).subscribe(() => {
                  this.route.navigate(['/wallet/dashboard']);
              });
          });

      }      
    }
}
