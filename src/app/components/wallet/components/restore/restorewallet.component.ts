import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletService } from '../../../../services/wallet.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Wallet } from '../../../../models/wallet';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-restore-wallet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './restorewallet.component.html',
  styleUrls: ['./restorewallet.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RestoreWalletComponent implements OnInit {
  userForm: FormGroup = {} as FormGroup;
  seedPhrase = '';
  seedPhraseInvalid = true;

  constructor(private route: Router, private fb: FormBuilder, private walletServ: WalletService, private localSt: StorageMap) {
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
    const pass = group.value.password;
    const confirmPass = group.value.pwdconfirm;
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

  autoGrowEvent(event: any) {
    const seedPhrase = (event.target as HTMLInputElement).value;
    this.autoGrow(seedPhrase);
  }

  onSubmit() {
    const name = this.userForm.value.name;
    const pwd = this.userForm.value.password;
    const mnemonic = this.seedPhrase;
    const wallet = this.walletServ.generateWallet(pwd, name, mnemonic);

    if (!wallet) {
      if (localStorage.getItem('Lan') === 'zh') {
        alert('发生错误，请再试一次。');
      } else {
        alert('Error occured, please try again.');
      }
    } else {
      this.localSt.get('wallets').subscribe((wallets: any) => {
        if (!wallets) {
          wallets = [];
        }
        if (wallets.indexOf(wallet) < 0) {
          wallets.push(wallet);
        }
        this.walletServ.saveCurrentWalletIndex(wallets.length - 1);
        this.localSt.set('wallets', wallets).subscribe(() => {
          this.route.navigate(['/wallet/dashboard']);
        });
      });

    }
  }
}
