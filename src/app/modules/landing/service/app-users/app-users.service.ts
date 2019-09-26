
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { HttpHelperService } from '../http-helper/http-helper.service';
import { Observable } from 'rxjs/Observable';
import { app } from '../../app.constants';
import { AppUsers } from '../../models/app-users';
import { AppAuthService } from '../../service/app-auth/app-auth.service';

const path = 'appUsers/';

@Injectable({
  providedIn: 'root'
})
export class AppUsersService {
  constructor(private http: Http, private httpHelper: HttpHelperService, private _appAuth: AppAuthService) { }

  getAppUser(userId: string) {
    const data = { userId: userId, appId: this._appAuth.id};
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', data);
    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.handleSuccess(retJson[0]);
    })
    .catch(this.handleError);
  }

  updateChildReferrals(children: Array<AppUsers>) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'updateChildren', children);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.handleSuccess(retJson);
    })
    .catch(this.handleError);
  }

  updateAppUserById(id: string, appUser) {
    let data = { id: id };
    data = Object.assign(data, appUser);
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'setParentReferralCode', data);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.handleSuccess(retJson);
    })
    .catch(this.handleError);
  }

  getChildReferrals(userId: string) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + 'getChildren/' + userId);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.handleSuccess(retJson);
    })
    .catch(this.handleError);
  }

  private handleSuccess(res) {
    return res;
  }

  private handleError(error) {
    // alert(JSON.stringify(error));
    return observableThrowError(error);
  }
}
