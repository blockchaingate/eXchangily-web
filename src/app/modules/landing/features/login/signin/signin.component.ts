import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { UserService } from '../../../service/user/user.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../../services/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../models/user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../style.scss']
})
export class SigninComponent implements OnInit {
  private afterLoginUrl: string;
  public submitted: boolean;
  private isSystemAdmin: boolean;
  loginError: string;
  user = { email: '', password: '' };
  signinForm: FormGroup;

  get email() { return this.signinForm.get('email'); }

  get password() { return this.signinForm.get('password'); }

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService, private _userAuth: UserAuth,
    private _storageServ: StorageService) {
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
        this.afterLoginUrl = params['retUrl'];
    });

    //console.log('token=', this._userAuth.token);
    this.isSystemAdmin = false;
    if (!this._userAuth.token) {
      this._storageServ.getToken().subscribe(
        (token: string) => {
          //console.log('token=', token);
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
    const token = loginRet.token;
    if (token) {

      this._userAuth.token = token;
      this._storageServ.storeToken(token);

      const helper = new JwtHelperService();

      const decodedToken = helper.decodeToken(token);

      if (decodedToken.aud === 'isSystemAdmin') {
        this.isSystemAdmin = true;
      }
    }

    this._userAuth.userDisplay$.next(loginRet.displayName);
    this._userAuth.isLoggedIn$.next(loginRet['id'] || loginRet._id);

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

    if (this.afterLoginUrl) {
      this._router.navigate([this.afterLoginUrl]);
    } else if (this.isSystemAdmin) {
      this._router.navigate(['/admin']);
    } else {
      this._router.navigate(['/account/user-info']);
    }

  }
}
