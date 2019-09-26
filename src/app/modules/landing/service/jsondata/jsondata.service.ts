
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class JsonFileService {
  constructor(private http: Http) {
  }

  get apiUrl(): string {
    return environment.endpoint;
  }

  get afterLoginUrl(): string {
    return sessionStorage.getItem('__AfterLoginUrl');
  }

  get needId(): number {
    return sessionStorage.__NeedId;
  }

  // Read a Json file
  getJsonFile(filePath: string) {
    return this.http.get(filePath).map((res: Response) => res.json()).catch(this.logAndPassOn);
  }

  private logAndPassOn (error: Error) {
    return observableThrowError(error);
  }

  // Get ApiUrl from app-config.json and save to sessionStorage;
  readQuand() {
    // alert("Url-: " + sessionStorage .getItem('_ApiUrl'));
    if (!sessionStorage.getItem('_ApiUrl')) {
      this.getJsonFile('data/app-config.json').subscribe(
        ret => sessionStorage.setItem('_quand', ret.quand),
        error => observableThrowError(error)
      );
    }
  }
}
