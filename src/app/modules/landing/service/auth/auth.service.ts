
import {of as observableOf} from 'rxjs';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  private _isLoggedIn = new BehaviorSubject(false);
  private _hasMerchant = false;
  public _lan = 'English';

  manageNews = 0;
  manageEmployee = 0;
  manageFinance = 0;
  manageCoins = 0;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  set loginStatus(isLoggedIn: boolean) {
    this._isLoggedIn.next(isLoggedIn);
  }

  isUserLoggedIn(): Subscription {
    return this._isLoggedIn.subscribe((loggedIn) => {
      return loggedIn;
    });
  }

  set hasMerchant(hasMerchant: boolean) {
    this._hasMerchant = hasMerchant;
  }

  get hasMerchant(): boolean {
    return this._hasMerchant;
  }

  set language(lan: string) {
    this._lan = lan;
  }

  get language(): string {
    return this._lan;
  }

  get lanCode(): string {
    let lanCode = 'EN';
    if (this._lan === '简体中文') {
      lanCode = 'CN';
    } else if (this._lan === 'Spanish' || this._lan === 'Español') {
      lanCode = 'SP';
    } else if (this._lan === 'French' || this._lan === 'Français') {
      lanCode = 'FR';
    }
    return lanCode;
  }

  login(): Observable<boolean> {
    return observableOf(true).delay(1000).do(val => this._isLoggedIn.next(true));
  }

  logout(): void {
    this._isLoggedIn.next(false);
  }
}
