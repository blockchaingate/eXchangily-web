
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { JsonFileService } from '../jsondata/jsondata.service';
import { Observable } from 'rxjs/Observable';
import { UserAuth } from '../user-auth/user-auth.service';
import { HttpHelperService } from '../http-helper/http-helper.service';

import { app } from '../../app.constants';
import { Kyc } from '../../models/kyc';

const path = 'kyc/';

@Injectable()
export class KycService {
  private body: any = { app:  app };

  constructor (private http: Http, private _userAuth: UserAuth,
               private _jsonService: JsonFileService, private httpHelper: HttpHelperService) {
  }

  // Create subscribe
  createKyc(kyc: Kyc) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', this._userAuth.token);
    const obj = Object.assign(this.body, kyc);
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'create', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
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
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path + id, this.body);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
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

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Get, path, this.body);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return <Kyc[]>retJson;
    })
    .catch(this.logAndPassOn);
  }


  // Find multiple KYCs
  findKYCs(theMemberId: string) {
    const query = { memberId: theMemberId};
    const obj = Object.assign(this.body, query);

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
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

    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'find', query);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const retJson = res.json();
      return <Kyc[]>retJson;
    })
    .catch(this.logAndPassOn);
  }

  // Update kyc
  updateKyc(kyc: Kyc) {
    const obj = Object.assign(this.body, kyc);
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'update', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
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
    const requestoptions: RequestOptions = this.httpHelper.getRequestObject(RequestMethod.Post, path + 'delete', obj);

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
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
