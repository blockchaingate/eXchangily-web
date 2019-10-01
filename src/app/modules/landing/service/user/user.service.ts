
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpService } from '../../../../services/http.service';
import { app } from '../../app.constants';
import { environment } from '../../../../../environments/environment';
const path = environment.endpoint + 'members/';

@Injectable()
export class UserService {

  constructor (private http: HttpService) {
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
      app: app
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

    return this.http.post(path + 'wallets', data)
    .map((res: any) => {
      if (res) {
        return this.convertResponseToUser(res);
      }
    })
    .catch(this.logAndPassOn);
  }

  public isAdmin(data: { userId: string, appId: string }) {
    /*
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(
      RequestMethod.Get, path + 'isAdmin/' + data.userId + '/' + data.appId, {}
    );
    */
    return this.http.get(path + 'isAdmin/' + data.userId + '/' + data.appId)
    .map((res: any) => {
      if (res) {
        return this.isAdminResponse(res);
      }
    })
    .catch(this.logAndPassOn);
  }

  // Get members
  public getUsers(data) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', data);

    return this.http.post(path + 'find', data)
    .map((res: any) => {
      if (res) {
        /*
        const retJson = res.json();
        return <User[]>retJson;
        */
        return res;
        // return [{ status: res.status, json: res.json()}];
      } else {
        return [];
      }
    })
    .catch(this.logAndPassOn);
  }

  // Get all members
  public getAllUsers() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path);

    return this.http.get(path)
    .map((res: any) => {
      if (res) {
        return res;
        /*
        const retJson = res.json();
        return <User[]>retJson;
        */
        // return [{ status: res.status, json: res.json()}];
      }
    })
    .catch(this.logAndPassOn);
  }

  // Login
  loginUser(email: string, password: string) {
    const theBody = {'email': email, 'password': password};
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'login', theBody);
    sessionStorage.removeItem('id_token');

    return this.http.post(path + 'login', theBody)
    .map((res: any) => {
      return this.convertResponseToUser(res);
    })
    .catch(this.logAndPassOn);
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
    return this.http.get(path + 'activation/' + email + '/' + activeCode)
    .map((res: any) => {
      return res.json();
    })
    .catch(this.logAndPassOn);
  }

  // Get member by using id
  getUserById(id: number | string) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id);

    return this.http.get(path + id)
    .map((res: any) => {
      return res;
      //return <User>res.json();
    })
    .catch(this.logAndPassOn);
  }

  getUsersAll() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'getAll');

    return this.http.post(path + 'getAll', {})
    .map((res: any) => {
      // const retJson = res.json();
      return res;
      // return [{ status: res.status, json: res.json()}];
    })
    .catch(this.logAndPassOn);
  }

  // Update member
  updateUser(data) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'FindOneAndUpdate', data);

    return this.http.post(path + 'FindOneAndUpdate', data)
    .map((res: any) => {
      return res;
      //const retJson = res.json();
      //return <User>retJson;
      // return [{ status: res.status, json: res.json()}];
    })
    .catch(this.logAndPassOn);
  }

  // Request Password Reset
  requestPwdReset(email: string) {
    const theBody = {'email': email};

    //const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'requestpwdreset', theBody);

    sessionStorage.removeItem('id_token');

    return this.http.post(path + 'requestpwdreset', theBody)
    .map((res: any) => {
      return this.convertResponseToUser(res);
    })
    .catch(this.logAndPassOn);
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

    return this.http.post(path + 'exepwdreset', theBody)
    .map((res: any) => {
      return res;
    })
    .catch(this.logAndPassOn);
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
