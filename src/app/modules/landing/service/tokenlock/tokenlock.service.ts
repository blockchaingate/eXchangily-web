
import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { UserAuth } from '../user-auth/user-auth.service';

import { app } from '../../app.constants';
import { Tokenlock } from '../../models/tokenlock';
import { environment } from '../../../../../environments/environment';
const path = environment.endpoints.blockchaingate + 'tokenlocks/';

@Injectable()
export class TokenlockService {
  private body: any = { app:  app };

  constructor (private http: HttpService, private _userAuth: UserAuth) {}

  // Create subscribe
  createTokenlock(tokenlock: Tokenlock) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', this._userAuth.token);
    const obj = Object.assign(this.body, tokenlock);
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'create', obj);

    return this.http.post(path + 'create', obj)
    .map((res: any) => {
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
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id, this.body);

    return this.http.get(path + id)
    .map((res: any) => {
      const retJson = res.json();
      return this.HandleSingleTokenlock(retJson);
    })
    .catch(this.logAndPassOn);
  }

    // Retrieve a subscribe by its id.
    getTokenlockByOwnerAddress(symbol: string, owneradd: string) {
        // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + symbol + '/' + owneradd, this.body);

        return this.http.get(path + symbol + '/' + owneradd)
        .map((res: any) => {
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

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path, this.body);

    return this.http.get(path)
    .map((res: any) => {
      const retJson = res.json();
      return <Tokenlock[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Find multiple Tokenlocks
  findTokenlocks(theMemberId: string) {
    const query = { memberId: theMemberId};
    const obj = Object.assign(this.body, query);

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', obj);

    return this.http.post(path + 'find', obj)
    .map((res: any) => {
      const retJson = res.json();
      return <Tokenlock[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Update tokenlock
  updateTokenlock(tokenlock: Tokenlock) {
    const obj = Object.assign(this.body, tokenlock);
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'update', obj);

    return this.http.post(path + 'update', obj)
    .map((res: any) => {
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
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'delete', obj);

    return this.http.post(path + 'delete', obj)
    .map((res: any) => {
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
