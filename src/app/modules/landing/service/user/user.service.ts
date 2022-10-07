
import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpService } from '../../../../services/http.service';
import { app } from '../../app.constants';
import { AppAuthService } from '../app-auth/app-auth.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs';

const path = environment.endpoints.blockchaingate + 'members/';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpService, private _appAuth: AppAuthService) {
  }

  // For signup
  public createUser(data) {
    const theBody = {
      email: data.email,
      password: data.password,
      walletExgAddress: data.walletExgAddress,
      campaignId: data.campaignId,
      firstName: data.firstName,
      lastName: data.lastName,
      invitationCode: data.invitationCode,
      referralCode: data.referralCode,
      app: app,
      appId: this._appAuth.id
    };

    return this.http.post(path + 'create', theBody).pipe(map(res => res, err => {alert(err); }));
  }

  // Get member
  public getUser(data) {
    return this.http.post(path + 'findOne', data, true).pipe(map(res => res));
  }

  public setWallets(data) {
    data.appId = this._appAuth.id;
    return this.http.post(path + 'wallets', data, true).pipe(map(res => res));
  }

  public isAdmin(data: { userId: string, appId: string }) {
    return this.http.get(path + 'isAdmin/' + data.userId + '/' + data.appId, true).pipe(map(res => res));
  }

  // Get members
  public getUsers(data) {
    return this.http.post(path + 'find', data, true).pipe(map(res => <Array<User>>res));
  }

  // Get all members
  public getAllUsers(token: string) {
    const apath = path + '?appId=' + this._appAuth.id;
    console.log('apath=', apath);
    return this.http.getPrivate(apath, token);
    // return this.http.get(path, true).pipe(map(res => res));
  }
  public getAllInactiveUsers(token: string) {
    const apath = path + 'inactive?appId=' + this._appAuth.id;
    console.log('apath=', apath);
    return this.http.getPrivate(apath, token);
    // return this.http.get(path, true).pipe(map(res => res));
  }

  public setActive(memberId: string, token: string) {
    const apath = path + 'setactive?memberId=' + memberId;
    return this.http.getPrivate(apath, token);
  }

  // Login
  loginUser(email: string, password: string) {
    const theBody = { email: email, password: password, appId: this._appAuth.id };
    sessionStorage.removeItem('id_token');
    return this.http.post(path + 'login', theBody).pipe(map(user => user));
  }

  // Activation
  activation(email: string, activeCode: string) {
    sessionStorage.setItem('id_token', '');
    return this.http.get(path + 'activation/' + email + '/' + activeCode).toPromise();
  }

  // Get member by using id
  getUserById(id: number | string) {
    return this.http.get(path + id, true).pipe(map(res => res));
  }

  getMe(token) {
    const url = path + 'me';
    return this.http.getPrivate(url, token).pipe(map(res => res));
  }

  getMerchant(token) {
    const url = path + 'merchant';
    return this.http.getPrivate(url, token).pipe(map(res => res));
  }

  validateNumber(token, mobile) {
    const url = path + 'validateNumber';
    const data = {
      mobile: mobile
    };
    return this.http.postPrivate(url, data, token).pipe(map(res => res));
  }

  confirmValifacationCode(token, mobileVerifyCode) {
    const url = path + 'confirmValifacationCode';
    const data = {
      mobileVerifyCode: mobileVerifyCode
    };
    return this.http.postPrivate(url, data, token).pipe(map(res => res));
  }

  getUsersAll() {
    return this.http.post(path + 'getAll', {}, true).pipe(map(res => res));
  }

  // Update member
  updateUser(data) {
    data.appId = this._appAuth.id;
    return this.http.post(path + 'FindOneAndUpdate', data, true).pipe(map(res => res));
  }

  setKycPass(data) {
    data.appId = this._appAuth.id;
    return this.http.post(path + 'setKycPass', data, true).pipe(map(res => res));    
  }
  
  // Request Password Reset
  requestPwdReset(email: string) {
    const theBody = { 'email': email, appId: this._appAuth.id };
    sessionStorage.removeItem('id_token');

    return this.http.post(path + 'requestpwdreset', theBody).toPromise();
  }

  // Execute Password Reset
  executePwdReset(id: string, pwdresetcode: string, passwd: string) {
    const theBody = {
      'id': id,
      'pwdresetcode': pwdresetcode,
      'passwd': passwd
    };

    sessionStorage.removeItem('id_token');
    return this.http.post(path + 'exepwdreset', theBody).toPromise();
  }

  /*
  private convertResponseToUser(res: Response) {
    let thisUser: User;

    if (res && res.status === 200) {
      const retJson = res.json();

      if (retJson) {
        thisUser = {
          _id: retJson['id'] || retJson['_id'],
          email: retJson['email'],
          displayName: retJson['displayName'],
          token: retJson['token'],
          kyc: retJson['kyc'],
          kycNote: retJson['kycNote'],
          defaultMerchant: retJson['defaultMerchant']
        };

        if (retJson['manageCoins']) { thisUser.manageCoins = retJson['manageCoins']; }
        if (retJson['manageEmployee']) { thisUser.manageEmployee = retJson['manageEmployee']; }
        if (retJson['manageFinance']) { thisUser.manageFinance = retJson['manageFinance']; }
        if (retJson['manageNews']) { thisUser.manageNews = retJson['manageNews']; }
      }
    }
    return !!thisUser;
  }
  */

  private isAdminResponse(res: any) {
    let answer = {};
    if (res && res.status === 200) {
      answer = res.json();
    }

    return answer;
  }

  private logAndPassOn(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let err;
    try {
      err = JSON.parse(error._body);
      if (!err.success) {
        err = err.message;
      }
    } catch (err) {
      err = 'Something went wrong with the server';
    }
    return observableThrowError(err);
  }
}
