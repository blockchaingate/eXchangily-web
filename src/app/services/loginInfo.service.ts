import { Injectable, OnInit, } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()
export class LoginInfoService{

    private isLogin = new BehaviorSubject(false);
    currentMessage = this.isLogin.asObservable();

    constructor() { }


    changeMessage(isLogin: boolean ) {
        this.isLogin.next(isLogin);
        // console.log("changeMessage isLogin: " + this.isLogin.value);
    }
}

