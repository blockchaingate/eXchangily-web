
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpService } from '../../../../services/http.service';
import { app } from '../../app.constants';
import { AppAuthService } from '../app-auth/app-auth.service';
import { environment } from '../../../../../environments/environment';
const path = environment.endpoints.blockchaingate + 'members/';

@Injectable()
export class UserService {

  constructor (private http: HttpService, private _appAuth: AppAuthService) {
  }

  // For signup
  public createUser(data) {
    const theBody = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      invitationCode: data.invitationCode,
      referralCode: data.referralCode,
      app: app,
      appId: this._appAuth.id
    };

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'Create', theBody);
    const url = path + 'Create';
    console.log('url=' + url);
    return this.http.post(url, theBody);
  }

  // Get member
  public getUser(data) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'findOne', data);

    return this.http.post(path + 'findOne', data);
  }

  public setWallets(data) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'wallets', data);
    data.appId = this._appAuth.id;

    // return this.http.post(path + 'wallets', data).subscribe((res: Response) => this.convertResponseToUser(res));
    return this.http.post(path + 'wallets', data);
  }

  public isAdmin(data: { userId: string, appId: string }) {
    /*
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(
      RequestMethod.Get, path + 'isAdmin/' + data.userId + '/' + data.appId, {}
    );
    */
    // return this.http.get(path + 'isAdmin/' + data.userId + '/' + data.appId).subscribe((res: Response) => this.isAdminResponse(res));
    return this.http.get(path + 'isAdmin/' + data.userId + '/' + data.appId);
  }

  // Get members
  public getUsers(data) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', data);

    // return this.http.post(path + 'find', data).subscribe((res: Response) => { if (res) { return res; } else { return []; } });
    return this.http.post(path + 'find', data);
  }

  // Get all members
  public getAllUsers() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path);

    return this.http.get(path);
  }

  // Login
  loginUser(email: string, password: string) {
    const theBody = {email: email, password: password, appId: this._appAuth.id};
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'login', theBody);
    sessionStorage.removeItem('id_token');

    // return this.http.post(path + 'login', theBody).subscribe((res: Response) => this.convertResponseToUser(res));
    return this.http.post(path + 'login', theBody);
  }

  // Activation
  activation(email: string, activeCode: string) {
    /*
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(
      RequestMethod.Get,
      path + 'activation/' + email + '/' + activeCode
    );
    */
    sessionStorage.setItem('id_token', '');
    return this.http.get(path + 'activation/' + email + '/' + activeCode);
  }

  // Get member by using id
  getUserById(id: number | string) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id);

    return this.http.get(path + id);
  }

  getUsersAll() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'getAll');

    return this.http.post(path + 'getAll', {});
  }

  // Update member
  updateUser(data) {
    data.appId = this._appAuth.id;
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'FindOneAndUpdate', data);

    return this.http.post(path + 'FindOneAndUpdate', data);
  }

  // Request Password Reset
  requestPwdReset(email: string) {
    const theBody = {'email': email};

    //const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'requestpwdreset', theBody);

    sessionStorage.removeItem('id_token');

    // return this.http.post(path + 'requestpwdreset', theBody).subscribe((res: Response) => this.convertResponseToUser(res));
    return this.http.post(path + 'requestpwdreset', theBody);
  }

  // Execute Password Reset
  executePwdReset(id: string, pwdresetcode: string, passwd: string) {
    const theBody = {
      'id': id,
      'pwdresetcode': pwdresetcode,
      'passwd': passwd
    };

    //const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'exepwdreset', theBody);

    sessionStorage.removeItem('id_token');
    return this.http.post(path + 'exepwdreset', theBody);
  }

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

      if (retJson['manageCoins']) {thisUser.manageCoins = retJson['manageCoins']; }
      if (retJson['manageEmployee']) {thisUser.manageEmployee = retJson['manageEmployee']; }
      if (retJson['manageFinance']) {thisUser.manageFinance = retJson['manageFinance']; }
      if (retJson['manageNews']) {thisUser.manageNews = retJson['manageNews']; }
    }
  }
  return thisUser;
}

private isAdminResponse(res: any) {
  let answer = {};
  if (res && res.status === 200) {
    answer = res.json();
  }

  return answer;
}

private logAndPassOn (error: any) {
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
