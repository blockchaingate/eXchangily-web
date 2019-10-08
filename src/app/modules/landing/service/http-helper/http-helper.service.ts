import { Injectable } from '@angular/core';
import { JsonFileService } from '../jsondata/jsondata.service';
import { UserAuth } from '../user-auth/user-auth.service';
import { AppAuthService } from '../app-auth/app-auth.service';

@Injectable()
export class HttpHelperService {
  private path: string;

  constructor(private _jsonFileService: JsonFileService, private _userAuth: UserAuth, private _appAuth: AppAuthService) {
    this.path = this._jsonFileService.apiUrl;
  }

  /*
  getRequestObject(method: RequestMethod, url: string, body: any = {}, includeApp: boolean = true) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this._userAuth.token) {
      headers.append('x-access-token', this._userAuth.token);
    }

    if (includeApp && this._appAuth.id) {
      body.appId = this._appAuth.id;
    }

    return new RequestOptions({
      method: method,
      url: this.path + url,
      headers: headers,
      body: JSON.stringify(body)
    });
  }
  */
}

