import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpService) {
  }

  getMe(token: string) {
    return this.http.get(environment.endpoints.blockchaingate + 'members/me?token=' + token);
  }

}