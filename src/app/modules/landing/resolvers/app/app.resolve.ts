
import {of as observableOf} from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { appId } from '../../app.constants';

import { AppService } from '../../service/app-service/app.service';
import { AppAuthService } from '../../service/app-auth/app-auth.service';

@Injectable()
export class AppResolver implements Resolve<any> {
  constructor(private _app: AppService, private _appAuth: AppAuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this._appAuth.id = appId;
    return observableOf(appId);
  }
}

@Injectable()
export class AppAdminResolver implements Resolve<any> {
  constructor(private _app: AppService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return observableOf(this._app.appAdminId);
  }
}
