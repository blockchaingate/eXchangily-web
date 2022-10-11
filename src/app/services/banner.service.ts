import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Config from '../../data/config.json';

@Injectable()
export class BannerService {
    constructor(private http: HttpClient) { }

    getAll() {
        const url = environment.endpoints.blockchaingate + 'banners/app/' + Config.appid;
        console.log('url===', url);
        return this.http.get(url);
    }

    getDefault() {
        return this.http.get('/images/adv/default/default-adv.json');
    }
}
