import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { UserService } from '../../../service/user/user.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../../services/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../models/user';

// Extend the User interface to include the 'id' property
declare module '../../../models/user' {
  interface User {
    id?: string;
  }
}
import { LoginInfoService } from '../../../../../services/loginInfo.service';
import { CampaignOrderService } from '../../../../../services/campaignorder.service';
import { LoginQualifyService } from '../../../../../services/lgoin-quality.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../style.scss']
})
export class SigninComponent implements OnInit {
  private afterLoginUrl = '';
  public submitted = false;
  private isSystemAdmin = false;
  loginError = '';
  user = { email: '', password: '' };
  signinForm: FormGroup = new FormGroup({});

  get email() { return this.signinForm.get('email'); }

  get password() { return this.signinForm.get('password'); }

  LoginInfo = false;
  LoginQualify = false;
  membership = '';

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService, private _userAuth: UserAuth,
    private _storageServ: StorageService,
    private LoginInfodata: LoginInfoService,
    private LoginQualifydata: LoginQualifyService,
    private campaignorderServ: CampaignOrderService,
  ) {
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.afterLoginUrl = params['retUrl'];
    });

    // console.log('token=', this._userAuth.token);
    this.isSystemAdmin = false;
    if (!this._userAuth.token) {
      this._storageServ.getToken().subscribe(
        (token: any) => {
          // console.log('token=', token);
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

    this.LoginInfodata.currentMessage.subscribe(isLogin => this.LoginInfo = isLogin);
    this.LoginQualifydata.currentMessage.subscribe(isQualify => this.LoginQualify = isQualify);
    // console.log("this.LoginInfo : " + this.LoginInfo.toString() );
    // console.log("this.LoginQualify : " + this.LoginQualify.toString() );

  }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    this._userService.loginUser(this.email?.value.toLowerCase(), this.password?.value)
      .subscribe((user: any) => this.processLogin(user),
        err => {
          this.submitted = false;
          this.loginError = err.error.message
        }
      );
  }

  processError(err: any) {
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
    this._userAuth.isLoggedIn$.next(loginRet._id);

    this._userAuth.hasWrite = loginRet.isWriteAccessAdmin ?? false;
    this._userAuth.id = loginRet._id || loginRet['id'] || '';
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

    //share login status with header menu
    // this.LoginInfo = false;
    // this.LoginQualify = false;
    if (token) {
      // this.LoginInfo = true;
      // this.LoginQualify = false;
      this.LoginInfodata.changeMessage(true);
    }
    //check if user joined campaign
    this.campaignorderServ.getProfile(token + '').subscribe(
      (res: any) => {
        if (res && res.ok) {
          //this.submitted = false;
          const body = res._body;
          this.membership = body.membership;
          if (this.membership && (this.membership != 'unqualified')) {

            // this.LoginInfo = true;
            // this.LoginQualify = true;
            this._storageServ.storeCampaignQualify();
            this.LoginQualifydata.changeMessage(true);
            // console.log("qualified!");

          }
        }
        // else {
        //   this.LoginInfodata.changeMessage(this.LoginInfo);
        //   this.LoginQualifydata.changeMessage(this.LoginQualify);
        // }

        // console.log("after login LoginInfodata: " + this.LoginInfo);
        // console.log("after login LoginQualifydata: " + this.LoginQualify);


        if (this.afterLoginUrl) {
          this._router.navigate([this.afterLoginUrl]);
        } else if (this.isSystemAdmin) {
          this._router.navigate(['/admin']);
        } else {
          this._router.navigate(['/account/user-info']);
        }
      },
      (error: any) => {
        //this.submitted = false;
        if (this.afterLoginUrl) {
          this._router.navigate([this.afterLoginUrl]);
        } else if (this.isSystemAdmin) {
          this._router.navigate(['/admin']);
        } else {
          this._router.navigate(['/account/user-info']);
        }
      }
    );

  }
}
