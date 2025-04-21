import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { WalletService } from '../../../../services/wallet.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Wallet } from '../../../../models/wallet';
@Component({
    selector: 'app-wallet-pwd',
    templateUrl: './wallet-pwd.component.html',
    styleUrls: ['./wallet-pwd.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletPwdComponent implements OnInit {
    userForm: FormGroup = new FormGroup({});

    constructor(private route: Router, private walletServ: WalletService, private fb: FormBuilder, private localSt: StorageMap) {
    }

    ngOnInit() {
        this.userForm = this.fb.group({
            type: [null, [Validators.required]],
            name: [null, [
                Validators.required,
                Validators.pattern(/^[A-z0-9]*$/),
                Validators.minLength(2)]
            ],
            password: [null, [
                Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#\(\)\$%\^&\*])(?=.{8,})/)]
            ],
            pwdconfirm: ['']
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.value.password;
        const confirmPass = group.value.pwdconfirm;

        return pass === confirmPass ? null : { notSame: true };
    }

    onSubmit() {

        const name = this.userForm.value.name;
        const pwd = this.userForm.value.password;

        // const mnemonic = sessionStorage.mnemonic.trim().replace(/\s\s+/g, ' ');
        let mnemonic = sessionStorage['mnemonic'];
        mnemonic = mnemonic.trim().replace(/\s\s+/g, ' ').replace(/(\r\n|\n|\r)/gm, '');
        const wallet = this.walletServ.generateWallet(pwd, name, mnemonic);

        sessionStorage.removeItem('mnemonic');

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
