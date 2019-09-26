
import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { JsonFileService } from '../jsondata/jsondata.service';
import { Observable } from 'rxjs/Observable';
import { UserAuth } from '../user-auth/user-auth.service';
import { HttpHelperService } from '../http-helper/http-helper.service';

import { app } from '../../app.constants';
import { Tokenlock } from '../../models/tokenlock';

const path = 'tokenlocks/';

@Injectable()
export class TokenlockService {
  private body: any = { app:  app };

  constructor (private http: Http, private _userAuth: UserAuth, private httpHelper: HttpHelperService) {}

  // Create subscribe
  createTokenlock(tokenlock: Tokenlock) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', this._userAuth.token);
    const obj = Object.assign(this.body, tokenlock);
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'create', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      let retJson;
      try {
        retJson = res.json();
      } catch (err) {
        retJson = res;
      }
      return this.HandleSingleTokenlock(retJson);
    })
    .catch(this.logAndPassOn);
  }

  // Retrieve a subscribe by its id.
  getTokenlock(id: number | string) {
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id, this.body);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return this.HandleSingleTokenlock(retJson);
    })
    .catch(this.logAndPassOn);
  }

    // Retrieve a subscribe by its id.
    getTokenlockByOwnerAddress(symbol: string, owneradd: string) {
        const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + symbol + '/' + owneradd, this.body);

        return this.http.request(new Request(requestoptions))
        .map((res: Response) => {
          const retJson = res.json();
          return <Tokenlock[]>retJson;
        })
        .catch(this.logAndPassOn);
    }

  // Get all Tokenlocks
  getAll() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', this._userAuth.token);

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path, this.body);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return <Tokenlock[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Find multiple Tokenlocks
  findTokenlocks(theMemberId: string) {
    const query = { memberId: theMemberId};
    const obj = Object.assign(this.body, query);

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return <Tokenlock[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Update tokenlock
  updateTokenlock(tokenlock: Tokenlock) {
    const obj = Object.assign(this.body, tokenlock);
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'update', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        const retJson = res.json();
        return this.HandleSingleTokenlock(retJson);
      }
    })
    .catch(this.logAndPassOn);
  }

  // Delete tokenlock
  deleteTokenlock(id: string) {
    const data = {id: id};
    const obj = Object.assign(this.body, data);
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'delete', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        const retJson = res.json();
        return this.HandleSingleTokenlock(retJson);
      }
    })
    .catch(this.logAndPassOn);
  }

  HandleSingleTokenlock(ret): Tokenlock {
    return <Tokenlock>ret;
  }

  HandleTokenlocks(ret): Tokenlock[] {
    return <Tokenlock[]>ret;
  }

  private logAndPassOn (error) {
    let errorObj;
    try {
      errorObj = JSON.parse(error._body);
    } catch (err) {
      errorObj = err;
    }
    return observableThrowError(errorObj);
  }
}
