import { Injectable, OnInit, } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()
export class LoginQualifyService implements OnInit {


    private isQualify = new BehaviorSubject(false);
    private storageServ: StorageService;
    currentMessage = this.isQualify.asObservable();

    constructor() { }

    ngOnInit() {
        // this.storageServ.getToken().subscribe(
        //     (token: string) => {
        //         if (token) {
        //             this.storageServ.getCampaignQualify().subscribe(
        //                 (Qualify: boolean) => {
        //                     this.changeMessage(Qualify);
        //             })
        //         }
        //     })
    }


    changeMessage(isQualify: boolean) {
        this.isQualify.next(isQualify);
        // console.log("changeMessage isQualify: " + this.isQualify.value);
    }
}
