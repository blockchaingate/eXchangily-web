import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserAuth } from '../../service/user-auth/user-auth.service';
import { map } from 'rxjs/operators/map';

import { Icotx } from '../../models/icotx';
import { IcotxService } from '../../service/icotx/icotx.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class IcotxResolver implements Resolve<Observable<Icotx>> {
  constructor(private __icotxService: IcotxService, private _userAuth: UserAuth, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.params.icotx === '' || !route.params.icotx) {
      this._router.navigate(['']);
    }

    return this.__icotxService.getIcotx(route.params.icotx).pipe(map((res: Icotx) => {
      if (res && (res.memberId === this._userAuth.id || res.email === this._userAuth.email)) {
        return res;
      } else {
        this._router.navigate(['']);
      }
    }));
  }
}

@Injectable()
export class IcotxParentResolver implements Resolve<Observable<Icotx>> {
  constructor(private __icotxService: IcotxService, private _userAuth: UserAuth, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.params.icotx === '' || !route.params.icotx) {
      this._router.navigate(['']);
    }

    return this.__icotxService.getIcotx(route.params.icotx).pipe(map((res: Icotx) => {
  
      if (res && (res.parentId === this._userAuth.id)) {
        return res;
      } else {
        this._router.navigate(['']);
      }
    }));
  }
}
