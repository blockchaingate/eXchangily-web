import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { UserAuth } from '../../service/user-auth/user-auth.service';

@Injectable()
export class NoAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private userAuth: UserAuth,
    private route: Router
  ) {
  }

  private isAuthenticated() {
    if (!!this.userAuth.isLoggedIn$.getValue()) {
      this.route.navigate(['/account/user-info'])
        .then(_ => console.error('You are already signed in!'))
        .catch(err => console.error(err));
      return false;
    }
    return true;
  }

  canActivateChild(next: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }
}
