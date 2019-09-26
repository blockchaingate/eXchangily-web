import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppService } from '../../service/app-service/app.service';
import { AppAuthService } from '../../service/app-auth/app-auth.service';

import { User } from '../../models/user';
import { UserAuth } from '../../service/user-auth/user-auth.service';
import { UserService } from '../../service/user/user.service';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(private _user: UserService, private _userAuth: UserAuth) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._userAuth.id) {
      return this._user.getUserById(this._userAuth.id)
      .map((res: User) => {
        return res;
      });
    }
  }
}

@Injectable()
export class UserAdminResolver implements Resolve<any> {
  constructor(private _user: UserService, private _userAuth: UserAuth,
              private _app: AppService, private _appAuth: AppAuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userId = this._userAuth.id;
    const appId = this._appAuth.id;
    return this._user.isAdmin({ userId: userId, appId: appId })
    .map((res: any) => {
      return res.isAdmin || false;
    });
  }

}
