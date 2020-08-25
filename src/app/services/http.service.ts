import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAuth } from '../modules/landing/service/user-auth/user-auth.service';
import { User } from '../modules/landing/models/user';

@Injectable()
export class HttpService {
    post(path: string, data: any, jwtAuth = false) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.userAuth.token
            });
        }
        const options = {
            headers: httpHeaders
        };
        return this.http.post(path, data, options);
    }

    postPrivate(path: string, data: any, token: string) {
        if (!token) {
            token = this.userAuth.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token
        });
        const options = {
            headers: httpHeaders
        };
        return this.http.post(path, data, options);
    }
 
    getPrivate(path: string, token: string) {
        if (!token) {
            token = this.userAuth.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token
        });
        const options = {
            headers: httpHeaders
        };
        return this.http.get(path, options);
    }

    get(path: string, jwtAuth = false) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.userAuth.token
            });
        }
        const options = {
            headers: httpHeaders
        };
       return this.http.get(path, options);
    }

    getRaw(path: string) {
        return this.http.get(path);
    }
    constructor(private http: HttpClient, private userAuth: UserAuth) {
    }
}
