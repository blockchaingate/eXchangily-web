import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable() 
export class RewardService {
    constructor(private http: HttpClient) {

    }
    getRewards() {
        const path = environment.endpoints.blockchaingate + 'tradereward';
        const res = this.http.get(path);
        return res;        
    }
}
