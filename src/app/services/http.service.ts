import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class HttpService {

    post (path: string, data: any) {
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-cache'
       });   
       const options = {
        headers: httpHeaders
        };
        return this.http.post(path, data, options);
    }
    get (path: string) {
        return this.http.get(path);
    }

    constructor (private http: HttpClient) {

    }
}
