import { HttpService } from '../../../../services/http.service';
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';

import { UserAuth } from '../user-auth/user-auth.service';
import { Icotx } from '../../models/icotx';

import { AppAuthService } from '../app-auth/app-auth.service';

const path = 'icotx/';

@Injectable()
export class IcotxService {
  constructor (private http: HttpService, private _userAuth: UserAuth,
              private _appAuth: AppAuthService) {}

  // Create subscribe
  createIcotx(icotx: Icotx) {
    delete icotx._id;
    icotx.memberId = this._userAuth.id;
    icotx.appId = this._appAuth.id;

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'create', icotx);

    return this.http.post(path + 'create', icotx)
    .map((res: any) => {
      const retJson = res.json();
      return this.HandleSingleIcotx(retJson);
    })
    .catch(this.logAndPassOn);
  }

  // Retrieve an IcoTx by its id.
  getIcotx(id: number | string) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id);

    return this.http.get(path + id)
    .map((res: any) => {
      const retJson = res.json();
      return this.HandleSingleIcotx(retJson);
    })
    .catch(this.logAndPassOn);
  }

  getChildIcotx(id: string) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + 'childOrders/' + id);

    return this.http.get(path + 'childOrders/' + id)
    .map((res: any) => {
      return res.json();
    })
    .catch(this.logAndPassOn);
  }

  // Get all Icotxes
  getAll() {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path);

    return this.http.get(path)
    .map((res: any) => {
      // alert(JSON.stringify(res));
      const retJson = res.json();
      return <Icotx[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Find multiple Icotxes
  findIcotxes(memberId: string, email?: string, ethAdd?: string, btcAdd?: string, fabAdd?: string) {
    const query: any = {};
    if (memberId) { query['memberId'] = memberId; }
    if (email) { query['email'] = email; }
    if (ethAdd) { query['ethAddress'] = ethAdd; }
    if (btcAdd) { query['btcAddress'] = btcAdd; }
    if (fabAdd) { query['fabAddress'] = fabAdd; }
    query['appId'] = this._appAuth.id;

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', query);

    return this.http.post(path + 'find', query)
    .map((res: any) => {
      const retJson = res.json();
      return <Icotx[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Update icotx
  updateIcotx(icotx: Icotx) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'Update', icotx);

    return this.http.post(path + 'Update', icotx)
    .map((res: any) => {
      if (res) {
        const retJson = res.json();
        return this.HandleSingleIcotx(retJson);
      }
    })
    .catch(this.logAndPassOn);
  }

  HandleSingleIcotx(ret): Icotx {
    return <Icotx>ret;
  }

  private logAndPassOn (error: Error) {
    alert(JSON.stringify(error));
    return observableThrowError(error);
  }
}
