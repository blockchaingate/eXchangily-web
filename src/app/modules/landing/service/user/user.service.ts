
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { JsonFileService } from '../jsondata/jsondata.service';
import { Observable } from 'rxjs/Observable';
import { HttpHelperService } from '../http-helper/http-helper.service';

import { UserAuth } from '../user-auth/user-auth.service';
import { User } from '../../models/user';

import { app } from '../../app.constants';
const path = 'members/';

@Injectable()
export class UserService {

  constructor (private http: Http, private _userAuth: UserAuth,
               private _jsonService: JsonFileService, private httpHelper: HttpHelperService) {
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

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'Create', theBody);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return res;
    })
    .catch(this.logAndPassOn);
  }

  // Get member
  public getUser(data) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'findOne', data);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        return this.convertResponseToUser(res);
      }
    })
    .catch(this.logAndPassOn);
  }

  public setWallets(data) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'wallets', data);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        return this.convertResponseToUser(res);
      }
    })
    .catch(this.logAndPassOn);
  }

  public isAdmin(data: { userId: string, appId: string }) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(
      RequestMethod.Get, path + 'isAdmin/' + data.userId + '/' + data.appId, {}
    );

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        return this.isAdminResponse(res);
      }
    })
    .catch(this.logAndPassOn);
  }

  // Get members
  public getUsers(data) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', data);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        const retJson = res.json();
        return <User[]>retJson;
        // return [{ status: res.status, json: res.json()}];
      } else {
        return [];
      }
    })
    .catch(this.logAndPassOn);
  }

  // Get all members
  public getAllUsers() {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        const retJson = res.json();
        return <User[]>retJson;
        // return [{ status: res.status, json: res.json()}];
      }
    })
    .catch(this.logAndPassOn);
  }

  // Login
  loginUser(email: string, password: string) {
    const theBody = {'email': email, 'password': password};
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'login', theBody);
    sessionStorage.removeItem('id_token');

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return this.convertResponseToUser(res);
    })
    .catch(this.logAndPassOn);
  }

  // Activation
  activation(email: string, activeCode: string) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(
      RequestMethod.Get,
      path + 'activation/' + email + '/' + activeCode
    );

    sessionStorage.setItem('id_token', '');
    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return res.json();
    })
    .catch(this.logAndPassOn);
  }

  // Get member by using id
  getUserById(id: number | string) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return <User>res.json();
    })
    .catch(this.logAndPassOn);
  }

  getUsersAll() {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'getAll');

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return retJson;
      // return [{ status: res.status, json: res.json()}];
    })
    .catch(this.logAndPassOn);
  }

  // Update member
  updateUser(data) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'FindOneAndUpdate', data);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return <User>retJson;
      // return [{ status: res.status, json: res.json()}];
    })
    .catch(this.logAndPassOn);
  }

  // Request Password Reset
  requestPwdReset(email: string) {
    const theBody = {'email': email};

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'requestpwdreset', theBody);

    sessionStorage.removeItem('id_token');

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
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

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'exepwdreset', theBody);

    sessionStorage.removeItem('id_token');

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return res;
    })
    .catch(this.logAndPassOn);
  }

  /*
     getUsers() {
     return this.http.get(this.path + '/members/')
     .map(res => <User[]> res.json().data)
     .catch(this.logAndPassOn);
//return Promise.resolve(MEMBERS);
}

signUp(member:User){
delete member.id;
delete member.firstName;
delete member.lastName;

// alert(JSON.stringify(member));

return this.http.post(this._jsonService.apiUrl + '/members/Create', "{'email':'paullby@gmail.com','password':'123321'}")
.map(res => <User> res.json().data)
.catch(this.logAndPassOn);
}

getUsersSlowly() {
return new Promise<User[]>(resolve =>
setTimeout(()=>resolve(MEMBERS), 2000) // 2 seconds
);
}
   */

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

private isAdminResponse(res: Response) {
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
