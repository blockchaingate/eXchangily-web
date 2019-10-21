
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { environment } from '../../../../../environments/environment';

import { HttpService } from '../../../../services/http.service';
import { JsonFileService } from '../jsondata/jsondata.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserAuth } from '../user-auth/user-auth.service';

const path = environment.endpoints.blockchaingate + 'announcements/';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  categories$: BehaviorSubject<Array<string>>;

  constructor(private http: HttpService, private _userAuth: UserAuth, private _jsonService: JsonFileService) { }

  /*
   * getAnnouncements
   * @description will retrieve an array of announcements
   * @return Array<Object>
   */
  getAnnouncements(lang): Observable<any> {
    return this.http.get(path + lang, true).pipe(map(res => res));
  }

  /*
   * updatePost
   * @description update given post information
   *
   */
  updatePost(post) {
    return this.http.post(path + 'updatePostById', JSON.stringify(post), true)
      .pipe(map(res => res));
  }

  deletePost(id) {
    return this.http.get(path + 'delete/' + id, true).pipe(map(res => res));
  }

  /*
   * getCategories
   * @description will retrieve array of new and announcement categories
   * @return Array<string>
   */
  getCategories() {
    return this.http.get(path + 'getCategories', true).pipe(map(res => res));
  }

  createAnnouncement(data) {
    return this.http.post(path + 'create', JSON.stringify(data))
      .pipe(map(res => res));
  }
}
