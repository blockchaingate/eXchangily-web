
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { UserAuth } from '../user-auth/user-auth.service';
import { HttpService } from '../../../../services/http.service';
import { app } from '../../app.constants';
import { Kyc } from '../../models/kyc';

const path = 'kyc/';

@Injectable()
export class KycService {
  private body: any = { app:  app };

  constructor (private http: HttpService, private _userAuth: UserAuth) {
  }

  // Create subscribe
  createKyc(kyc: Kyc) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', this._userAuth.token);
    const obj = Object.assign(this.body, kyc);
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'create', obj);

    return this.http.post(path + 'create', obj)
    .map((res: any) => {
      let retJson ;
      try {
        retJson = res.json();
      } catch (err) {
        retJson = res;
      }
      return this.HandleSingleKyc(retJson);
    })
    .catch(this.logAndPassOn);
  }

  // Retrieve a subscribe by its id.
  getKyc(id: number | string) {
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id, this.body);

    return this.http.get(path + id)
    .map((res: any) => {
      const retJson = res.json();
      return this.HandleSingleKyc(retJson);
    })
    .catch(this.logAndPassOn);
  }

  // Get all KYCs
  getAll() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', this._userAuth.token);

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path, this.body);

    return this.http.get(path)
    .map((res: any) => {
      const retJson = res.json();
      return <Kyc[]>retJson;
    })
    .catch(this.logAndPassOn);
  }


  // Find multiple KYCs
  findKYCs(theMemberId: string) {
    const query = { memberId: theMemberId};
    const obj = Object.assign(this.body, query);

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', obj);

    return this.http.post(path + 'find', obj)
    .map((res: any) => {
      const retJson = res.json();
      return <Kyc[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // usuall don't need memberId;
  searchKYCs(memberId: string, email: string, ETHadd: string) {
    const query = this.body;
    if (memberId) { query['memberId'] = memberId; }
    if (email) { query['email'] = email; }
    if (ETHadd) { query['ETHadd'] = ETHadd; }

    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', query);

    return this.http.post( path + 'find', query )
    .map((res: any) => {
      const retJson = res.json();
      return <Kyc[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Update kyc
  updateKyc(kyc: Kyc) {
    const obj = Object.assign(this.body, kyc);
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'update', obj);

    return this.http.post(path + 'update', obj)
    .map((res: any) => {
      if (res) {
        const retJson = res.json();
        return this.HandleSingleKyc(retJson);
      }
    })
    .catch(this.logAndPassOn);
  }

  // Delete kyc
  deleteKYC(id: string) {
    const data = {id: id};
    const obj = Object.assign(this.body, data);
    // const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'delete', obj);

    return this.http.post(path + 'delete', obj)
    .map((res: any) => {
      if (res) {
        const retJson = res.json();
        return this.HandleSingleKyc(retJson);
      }
    })
    .catch(this.logAndPassOn);
  }

  HandleSingleKyc(ret): Kyc {
    return <Kyc>ret;
  }

  private logAndPassOn (error) {
    let errorObj;
    try {
      errorObj = JSON.parse(error._body);
    } catch (err) {
      errorObj = err;
    }
    return observableThrowError(errorObj);
  }
}
