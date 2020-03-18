import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable()
export class MerchantService {
    constructor( private utilServ: UtilService) {
    } 

    getMerchant(name: string) {
    }

}
