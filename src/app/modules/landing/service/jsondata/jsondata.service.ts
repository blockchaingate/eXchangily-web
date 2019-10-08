
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../../../services/http.service';
@Injectable()
export class JsonFileService {
  constructor(private http: HttpService) {
  }

  get apiUrl(): string {
    return environment.endpoints.blockchaingate;
  }

  get afterLoginUrl(): string {
    return sessionStorage.getItem('__AfterLoginUrl');
  }

  get needId(): number {
    return sessionStorage.__NeedId;
  }

  // Read a Json file
  getJsonFile(filePath: string) {
    console.log('filePath=' + filePath);
    return this.http.get(filePath);
  }

  private logAndPassOn (error: Error) {
    return observableThrowError(error);
  }

  // Get ApiUrl from app-config.json and save to sessionStorage;
  readQuand() {
    // alert("Url-: " + sessionStorage .getItem('_ApiUrl'));
    if (!sessionStorage.getItem('_ApiUrl')) {
      this.getJsonFile('data/app-config.json').subscribe(
        (ret: any) => sessionStorage.setItem('_quand', ret.quand),
        error => observableThrowError(error)
      );
    }
  }
}
