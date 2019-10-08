import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Injectable({
  providedIn: 'root'
})
export class RouteServiceService {
  private _router: Router;

  constructor(private _r: Router) {
    this._router = _r;
  }

  getCurrentRoute(): Subscription {
    return this._router.events
    .subscribe((routeEvent: RouterEvent) => {
      // only determine url on navigate end
      // we only want values on urlAfterRedirects
      if (routeEvent instanceof NavigationEnd) {
        return routeEvent.urlAfterRedirects;
      }
    });
  }
}
