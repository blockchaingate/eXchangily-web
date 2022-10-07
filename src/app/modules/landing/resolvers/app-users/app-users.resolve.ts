import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';

import { AppUsers } from '../../models/app-users';
import { AppUsersService } from '../../service/app-users/app-users.service';
import { UserAuth } from '../../service/user-auth/user-auth.service';

@Injectable()
export class AppUsersResolver implements Resolve<any> {
  constructor(private _appUsers: AppUsersService, private _userAuth: UserAuth, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this._userAuth.id) {
      this._router.navigate(['']);
    }
    return this._appUsers.getAppUser(this._userAuth.id).pipe(map(res => (<AppUsers>res)[0]));
  }
}

@Injectable()
export class ChildReferralsResolver implements Resolve<any> {
  constructor(private _appUsers: AppUsersService, private _userAuth: UserAuth, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this._userAuth.id) {
      this._router.navigate(['']);
    }
    return this._appUsers.getChildReferrals(this._userAuth.id).pipe(map(res => < AppUsers[]> res));
  }
}
