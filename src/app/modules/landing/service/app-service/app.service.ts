import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Application } from '../../models/application';
import { environment } from '../../../../../environments/environment';
import { appId } from '../../app.constants';
import { HttpService } from '../../../../services/http.service';
import { map } from 'rxjs';

const path = environment.endpoints.blockchaingate + 'apps/';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  appAdminId: any;
  appAdminEmail: any;
  app: Application = {} as Application;

  constructor(private http: HttpService) { }

  getApp() {
    return this.http.get(path + appId, true).pipe(map((res: any) => {
      this.app = res[0];
      this.appAdminId = this.app.appAdminId;
      this.appAdminEmail = this.app.appAdmin;
      return res[0];
    }));
  }

  updateApp (appl: Application ) {
    return this.http.post(path + 'update', appl, true).pipe(map(user => user));
  }
}
