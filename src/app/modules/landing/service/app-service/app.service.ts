import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Application } from '../../models/application';
import { appId } from '../../app.constants';
import { HttpService } from '../../../../services/http.service';

const path = 'apps/';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  appAdminId: string;
  appAdminEmail: string;
  app: Application;

  constructor(private http: HttpService) { }

  getApp() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + appId);

    return this.http.get(path + appId)
    .map((res: any) => {
      const retJson = res.json();
      this.app = retJson[0];
      this.appAdminId = this.app.appAdminId;
      this.appAdminEmail = this.app.appAdmin;
      return this.handleSuccess(this.app);
    })
    .catch(this.handleError);
  }

  updateApp (appl: Application ) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'update', appl);

    return this.http.post(path + 'update', appl)
    .map((res: any) => {
      const retJson = res.json();
      return this.handleSuccess(retJson);
    })
    .catch(this.handleError);
  }

  private handleSuccess(res) {
    return res;
  }

  private handleError(error) {
    return observableThrowError(error);
  }
}
