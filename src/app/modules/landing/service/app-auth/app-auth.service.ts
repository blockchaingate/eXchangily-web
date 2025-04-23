import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(appId: string) {
    this._id = appId;
  }

  constructor() {}
}
