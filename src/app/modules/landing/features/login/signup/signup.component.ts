import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { Wallet } from '../../.../../../../../models/wallet';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../style.scss']
})
export class SignupComponent implements OnInit {
  user = { email: '', password: '' };
  repeatPassword = '';
  signupForm: FormGroup;
  passwordMin = 5;
  serverErrorMsg: string;

  constructor(private _userService: UserService, private _router: Router, private _activeRout: ActivatedRoute, private localSt: LocalStorage) {
  }

  get email() { return this.signupForm.get('email'); }

  get password() { return this.signupForm.get('password'); }

  get repeatPsw() { return this.signupForm.get('repeatPassword'); }

  get referralCode() { return this.signupForm.get('referralCode'); }

  ngOnInit() {
    const strRefCode: string = this._activeRout.snapshot.paramMap.get('refcode');

    this.signupForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(this.passwordMin)
      ]),
      'repeatPassword': new FormControl('', [
        Validators.required,
      ]),
      'referralCode': new FormControl(strRefCode, [])
    });
    // this.signupForm.setValue({referralCode: strRefCode});
    this.signupForm.controls['referralCode'].setValue(strRefCode);
  }

  onSubmit() {
    if (this.user.password !== this.repeatPassword) {
      return;
    }

   // this.localSt.getItem('wallets').subscribe(() => {
    const walletExgAddress = 'abc1234567890';

    this.serverErrorMsg = '';
    this._userService.createUser({
      email: this.email.value, password: this.password.value,
      walletExgAddress: walletExgAddress,
      referralCode: this.referralCode.value, campaignId: environment.campaignId }).subscribe(
      ret => this.processSignup(ret),
      error => {
         // alert(JSON.stringify(error));
        this.serverErrorMsg = error.error.message;
      }
    );

    // });
  }

  processSignup(signupRet: any) {
    this.password.setValue('');
    this.serverErrorMsg = '';
    // const retJson = signupRet.json();
    this._router.navigate(['/login/activate']);
  }
}
