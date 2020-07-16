import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable() 
export class AirdropService {
    constructor(private http: HttpClient) {

    }
    getQuestionair(address: string, ip: string) {
        const url = environment.endpoints.blockchaingate + 'airdrop/getQuestionair/' + address + '/' + ip;
        return this.http.get(url);
    }

    answerQuestionair(address: string, questionair_id: string, answer: string) {
        const data = {
            address: address,
            questionair_id: questionair_id,
            answer: answer
        };
        const url = environment.endpoints.blockchaingate + 'airdrop/answerQuestionair';
        return this.http.post(url, data);       
    }
}
