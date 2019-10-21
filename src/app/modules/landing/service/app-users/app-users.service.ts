
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AppUsers } from '../../models/app-users';
import { AppAuthService } from '../../service/app-auth/app-auth.service';
import { map } from 'rxjs/operators/map';
import { environment } from '../../../../../environments/environment';

const path = environment.endpoints.blockchaingate + 'appUsers/';

@Injectable({
  providedIn: 'root'
})
export class AppUsersService {
  constructor(private http: HttpService, private _appAuth: AppAuthService) { }

  getAppUser(userId: string) {
    const data = { userId: userId, appId: this._appAuth.id };
    return this.http.post(path + 'find', data, true).pipe(map(res => res));
  }

  updateChildReferrals(children: Array<AppUsers>) {
    return this.http.post(path + 'updateChildren', children, true).pipe(map(res => res));
  }

  updateAppUserById(id: string, appUser) {
    let data = { id: id };
    data = Object.assign(data, appUser);
    return this.http.post(path + 'setParentReferralCode', data, true).pipe(map(res => res));
  }

  getChildReferrals(userId: string) {
    return this.http.get(path + 'getChildren/' + userId, true).pipe(map(referrals => referrals));
  }
}
