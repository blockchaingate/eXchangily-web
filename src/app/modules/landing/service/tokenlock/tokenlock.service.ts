
import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { UserAuth } from '../user-auth/user-auth.service';
import { map } from 'rxjs';

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
    const obj = Object.assign(this.body, tokenlock);
    return this.http.post(path + 'create', obj, true).pipe(map(res => <Tokenlock>res));
  }

  // Retrieve a subscribe by its id.
  getTokenlock(id: number | string) {
    return this.http.get(path + id, true).pipe(map(res => <Tokenlock>res));
  }

    // Retrieve a subscribe by its id.
    getTokenlockByOwnerAddress(symbol: string, owneradd: string) {
      return this.http.get(path + symbol + '/' + owneradd, true).pipe(map(res => <Tokenlock[]>res));
    }

  // Get all Tokenlocks
  getAll() {
    return this.http.get(path, true).pipe(map(res => <Tokenlock[]>res));
  }

  // Find multiple Tokenlocks
  findTokenlocks(theMemberId: string) {
    const query = { memberId: theMemberId};
    const obj = Object.assign(this.body, query);

    return this.http.post(path + 'find', obj, true).pipe(map(res => <Tokenlock[]>res));
  }

  // Update tokenlock
  updateTokenlock(tokenlock: Tokenlock) {
    const obj = Object.assign(this.body, tokenlock);
    return this.http.post(path + 'update', obj, true).pipe(map(res => <Tokenlock>res));
  }

  // Delete tokenlock
  deleteTokenlock(id: string) {
    const data = {id: id};
    const obj = Object.assign(this.body, data);

    return this.http.post(path + 'delete', obj, true).pipe(map(res => <Tokenlock>res));
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
