/*
    Move-fund service executes move fund between wallet and exchange:
    1) for moving fund from wallet to exchange, include 2 steps, the first step is to send original coin to related address
       dominated by FAB; 
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyCoin } from '../models/mycoin';

import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class MoveFundService {
    constructor(private http: HttpClient, private configServ: ConfigService) {
    }

    moveToExchangily(coin: MyCoin, amount: number) {

    }

    moveToWallet(coin: MyCoin, amount: number) {
        
    }

}
