
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { JsonFileService } from '../jsondata/jsondata.service';
import { Observable } from 'rxjs/Observable';



import { User } from '../../models/user';
import { UserAuth } from '../user-auth/user-auth.service';

@Injectable()
export class FormService {

  constructor (private http: Http, private _userAuth: UserAuth, private _jsonService: JsonFileService) {}

  public getForms(user: User) {
    // must be admin to complete request
  }

  public addAmbassador(data) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let socialHandles: Array<string>;

    if (data.social) {
      socialHandles = data.social.replace(' ', '').split(',');
    }

    const theBody = {
      email: data.email,
      fullName: data.name,
      city: data.city,
      country: data.country,
      socialMedia: socialHandles,
      description: data.why
    };

    const requestoptions: RequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this._jsonService.apiUrl + '/forms/AddAmbassador',
      headers: headers,
      body: JSON.stringify(theBody)
    });

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return res;
    })
    .catch(this.handleIssue);
  }

  handleIssue(error) {
    const err = JSON.parse(error._body);
    return observableThrowError(err.message);
  }
}
