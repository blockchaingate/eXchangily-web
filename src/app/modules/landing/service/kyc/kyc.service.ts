
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { UserAuth } from '../user-auth/user-auth.service';
import { HttpService } from '../../../../services/http.service';
import { app } from '../../app.constants';
import { Kyc } from '../../models/kyc';

const path = environment.endpoints.blockchaingate + 'kyc/';

@Injectable()
export class KycService {
  private body: any = { app: app };
  constructor(private http: HttpService, private _userAuth: UserAuth) {
  }

  // Create subscribe
  createKyc(kyc: Kyc, token: string) {
    console.log('begin createKyc');
    const obj = Object.assign(this.body, kyc);
    console.log('obj===', obj);
    console.log('path=', path + 'create');
    return this.http.postPrivate(path + 'create', obj, token).pipe(map(res => res));
  }

  // Retrieve a subscribe by its id.
  getKyc(id: number | string) {
    return this.http.get(path + id, true).pipe(map(res => res));
  }

  // Get all KYCs
  getAll() {
    return this.http.get(path, true).pipe(map(res => <Kyc[]>res));
  }

  // Find multiple KYCs
  findKYCs(theMemberId: string) {
    const query = { memberId: theMemberId };
    const obj = Object.assign(this.body, query);

    return this.http.post(path + 'find', obj, true).pipe(map(res => <Kyc[]>res));
  }

  // usuall don't need memberId;
  searchKYCs(memberId: string, email: string, ETHadd: string) {
    const query = this.body;
    if (memberId) { query['memberId'] = memberId; }
    if (email) { query['email'] = email; }
    if (ETHadd) { query['ETHadd'] = ETHadd; }

    return this.http.post(path + 'find', query, true).pipe(map(res => <Kyc[]>res));
  }

  // Update kyc
  updateKyc(kyc: Kyc) {
    const obj = Object.assign(this.body, kyc);
    return this.http.post(path + 'update', obj, true).pipe(map(res => <Kyc>res));
  }

  // Delete kyc
  deleteKYC(id: string) {
    const data = { id: id };
    const obj = Object.assign(this.body, data);

    return this.http.post(path + 'delete', obj, true).pipe(map(res => <Kyc>res));
  }
}
