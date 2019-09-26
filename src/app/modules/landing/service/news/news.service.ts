
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { JsonFileService } from '../jsondata/jsondata.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserAuth } from '../user-auth/user-auth.service';

import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  categories$: BehaviorSubject<Array<string>>;

  constructor(private http: Http, private _userAuth: UserAuth, private _jsonService: JsonFileService) {}

  /*
   * getAnnouncements
   * @description will retrieve an array of announcements
   * @return Array<Object>
   */
  getAnnouncements(lang): Observable<any> {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestoptions = new RequestOptions({
      method: RequestMethod.Get,
      url: this._jsonService.apiUrl + '/announcements/' + lang,
      headers: headers
    });

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      if (res) {
        const retJson = res.json();
        return retJson.body;
      }
    })
    .catch(this.handleIssue);
  }

  /*
   * updatePost
   * @description update given post information
   *
   */
  updatePost(post) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('x-access-token', this._userAuth.token);
    const requestoptions: RequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this._jsonService.apiUrl + '/announcements/updatePostById',
      headers: headers,
      body: JSON.stringify(post)
    });

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const response = (<any>res)._body;
      return JSON.parse(response);
    })
    .catch(this.handleIssue);
  }

  deletePost(id) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('x-access-token', this._userAuth.token);
    const requestoptions: RequestOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: this._jsonService.apiUrl + '/announcements/delete/' + id,
      headers: headers
    });

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const response = (<any>res)._body;
      if (response) { 
        return JSON.parse(response);
      }
      return true;
    })
    .catch(this.handleIssue);
  }
  /*
   * getCategories
   * @description will retrieve array of new and announcement categories
   * @return Array<string>
   */
  getCategories() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('x-access-token', this._userAuth.token);
    const requestoptions: RequestOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: this._jsonService.apiUrl + '/announcements/getCategories',
      headers: headers
    });

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      const response = (<any>res)._body;
      return JSON.parse(response);
    })
    .catch(this.handleIssue);
  }



  createAnnouncement(data) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestoptions: RequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this._jsonService.apiUrl + '/announcements/create',
      headers: headers,
      body: JSON.stringify(data)
    });

    return this.http.request(new Request(requestoptions))
    .map((res: Response) => {
      return JSON.parse((<any> res)._body);
    })
    .catch(this.handleIssue);
  }

  private handleIssue(error) {
    console.log(error);
    // const err = JSON.parse(error._body);
    return observableThrowError(error);
  }
}
