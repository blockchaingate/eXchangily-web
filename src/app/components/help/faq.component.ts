import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserAuth } from '../../modules/landing/service/user-auth/user-auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { LanService } from 'src/app/services/lan.service';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit{
    message: string;

    constructor(
        public _authServ: UserAuth,
        private lanData: LanService
        // private storageService: StorageService,
    ) { }

    ngOnInit() {
        this.lanData.currentMessage.subscribe(message => this.message = message)
        // console.log("CurrentLang: "+ this.storageService.getCurrentLang().toString());
        // console.log("lan: " +window.localStorage.getItem('Lan'));

    }
}
