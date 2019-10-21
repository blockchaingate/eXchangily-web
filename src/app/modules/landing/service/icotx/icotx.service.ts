import { HttpService } from '../../../../services/http.service';
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { environment } from '../../../../../environments/environment';

import { UserAuth } from '../user-auth/user-auth.service';
import { Icotx } from '../../models/icotx';

import { AppAuthService } from '../app-auth/app-auth.service';

const path = environment.endpoints.blockchaingate + 'icotx/';

@Injectable()
export class IcotxService {
  constructor (private http: HttpService, private _userAuth: UserAuth,
              private _appAuth: AppAuthService) {}

  // Create subscribe
  createIcotx(icotx: Icotx) {
    delete icotx._id;
    icotx.memberId = this._userAuth.id;
    icotx.appId = this._appAuth.id;

    return this.http.post(path + 'create', icotx, true).pipe(map(res => res));
  }

  // Retrieve an IcoTx by its id.
  getIcotx(id: number | string) {
    return this.http.get(path + id, true).pipe(map(res => res));
  }

  getChildIcotx(id: string) {
    return this.http.get(path + 'childOrders/' + id, true).pipe(map(res => res));
  }

  // Get all Icotxes
  getAll() {
    return this.http.get(path, true).pipe(map(res => <Icotx[]>res));
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

    return this.http.post(path + 'find', query, true).pipe(map(res => <Icotx[]>res));
  }

  // Update icotx
  updateIcotx(icotx: Icotx) {
    return this.http.post(path + 'Update', icotx, true).pipe(map(res => res));
  }
}
