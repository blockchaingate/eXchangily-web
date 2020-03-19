import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user/user.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../../services/storage.service';

import { User } from '../../../models/user';
// import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/typings/scroll/scroll-strategy';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../style.scss']
})
export class SigninComponent implements OnInit {
  private afterLoginUrl = '/member/profile';
  private submitted: boolean;

  loginError: string;
  user = { email: '', password: '' };
  signinForm: FormGroup;

  get email() { return this.signinForm.get('email'); }

  get password() { return this.signinForm.get('password'); }

  constructor(
    private _router: Router, 
    private _userService: UserService, 
    private _userAuth: UserAuth,
    private _storageServ: StorageService
    ) {
  }

  ngOnInit() {
    console.log('token=', this._userAuth.token);
    if (!this._userAuth.token) {
      this._storageServ.getToken().subscribe(
        (token: string) => {
          console.log('token=', token);
        }
      );
    }
    this.signinForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(this.user.password, [
        Validators.required
      ])
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    this._userService.loginUser(this.email.value.toLowerCase(), this.password.value)
      .subscribe((user: User) => this.processLogin(user),
        err => this.loginError = err.error.message
      );
  }

  processError(err) {
    this.loginError = err.message;
  }

  processLogin(loginRet: User) {
    this.user.password = '';
    this._userAuth.isLoggedIn$.next('');

    this._userAuth.token = '';
    this._userAuth.manageCoins = 0;
    this._userAuth.manageEmployee = 0;
    this._userAuth.manageFinance = 0;
    this._userAuth.manageNews = 0;
    this._userAuth.kyc = 0;

    if (loginRet.token) {
      this._userAuth.token = loginRet.token;
      this._storageServ.storeToken(loginRet.token);
    }

    this._userAuth.userDisplay$.next(loginRet.displayName);
    this._userAuth.isLoggedIn$.next(loginRet._id || loginRet['id']);
    this._userAuth.hasWrite = loginRet.isWriteAccessAdmin;
    this._userAuth.id = loginRet._id || loginRet['id'];
    this._userAuth.email = loginRet.email;
    this._userAuth.kyc = loginRet.kyc;
    this._userAuth.kycNote = loginRet.kycNote;
    if (loginRet.manageCoins) { this._userAuth.manageCoins = loginRet.manageCoins; }
    if (loginRet.manageEmployee) { this._userAuth.manageEmployee = loginRet.manageEmployee; }
    if (loginRet.manageFinance) { this._userAuth.manageFinance = loginRet.manageFinance; }
    if (loginRet.manageNews) { this._userAuth.manageNews = loginRet.manageNews; }
    if (loginRet.defaultMerchant && loginRet.defaultMerchant._id) {
      this._userAuth.hasMerchant = true;
    }

    const toUrl = sessionStorage.__AfterLoginUrl ? sessionStorage.__AfterLoginUrl : this.afterLoginUrl;

    this._router.navigate(['/account/user-info']);
  }
}
