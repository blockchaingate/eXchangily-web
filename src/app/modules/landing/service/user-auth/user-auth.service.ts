import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { root } from 'rxjs/internal/util/root';


@Injectable({providedIn: 'root', })
export class UserAuth {
  private _hasMerchant = false;
  private _hasWriteAccess = false;
  private _id;
  private _email;
  private _token;
  private _kyc;
  private _kycNote = '';
  public _lan = 'English';
  loggedIn = false;

  isLoggedIn$ = new BehaviorSubject('');
  userDisplay$ = new BehaviorSubject('');
  manageNews = 0;
  manageEmployee = 0;
  manageFinance = 0;
  manageCoins = 0;


  // store the URL so we can redirect after logging in
  redirectUrl: string;

  get id() { return this._id; }

  set id(newId) { this._id = newId; }

  get kyc() { return this._kyc; }

  set kyc(theKyc) {
    /*
    if (!theKyc || theKyc === 0) {
      this._kyc = 'no kyc';
    } else if (theKyc === -1) {
      this._kyc = 'denied';
    } else if (theKyc === 1 || theKyc === 2 ) {
      this._kyc = 'waitting for process';
    } else if (theKyc === 3) {
      this._kyc = 'KYC has problem';
    } else if (theKyc === 100) {
      this._kyc = 'KYC passed';
    }
    */
   this._kyc = theKyc;
  }

  get kycNote() { return this.kycNote; }

  set kycNote(kycNote) { this._kycNote = kycNote; }

  get email() { return this._email; }

  set email(email) { this._email = email; }

  get token() { return this._token; }

  set token(token) { 
    this._token = token; 
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

  set hasWrite(hasWriteAccess: boolean) {
    this._hasWriteAccess = hasWriteAccess;
  }
  get hasWrite(): boolean {
    return this._hasWriteAccess;
  }

  logout(): void {
    this.isLoggedIn$.next('');
    this.userDisplay$.next('');
    this._hasWriteAccess = false;
  }
}
