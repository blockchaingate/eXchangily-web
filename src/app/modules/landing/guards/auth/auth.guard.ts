import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { UserAuth } from '../../service/user-auth/user-auth.service';
import { StorageService } from '../../../../services/storage.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private userAuth: UserAuth,
    private _storageServ: StorageService,
    private route: Router
  ) {
  }

  private isAuthenticated() {
    console.log('isAuthenticated===');
    if (!this.userAuth.isLoggedIn$.getValue()) {
      this._storageServ.getToken().subscribe(
        (token: string) => {
          if(!token) {
            this.route.navigate(['/login/signin'])
            .then(_ => console.error('You are not signed in!'))
            .catch(err => console.error(err));
          return false;
          }
        }
      );

    }

    return true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }
}
