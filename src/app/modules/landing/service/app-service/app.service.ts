import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Application } from '../../models/application';
import { environment } from '../../../../../environments/environment';
import { appId } from '../../app.constants';
import { HttpService } from '../../../../services/http.service';
import { map } from 'rxjs/operators/map';

const path = environment.endpoints.blockchaingate + 'apps/';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  appAdminId: string;
  appAdminEmail: string;
  app: Application;

  constructor(private http: HttpService) { }

  getApp() {
    return this.http.get(path + appId, true).pipe(map(res => {
      this.app = res;
      this.appAdminId = this.app.appAdminId;
      this.appAdminEmail = this.app.appAdmin;
      return res;
    }));
  }

  updateApp (appl: Application ) {
    return this.http.post(path + 'update', appl, true).pipe(map(user => user));
  }
}
