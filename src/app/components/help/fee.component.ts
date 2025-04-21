import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../modules/landing/service/user-auth/user-auth.service';
import { LanService } from '../../services/lan.service';

@Component({
    selector: 'app-fee',
    templateUrl: './fee.component.html',
    styleUrls: ['./faq.component.css']
})
export class FeeComponent implements OnInit {
    message = '';

    constructor(public _authServ: UserAuth, private lanData: LanService) { }

    ngOnInit() {
        this.lanData.currentMessage.subscribe(message => this.message = message)
        // console.log("CurrentLang: "+ this.storageService.getCurrentLang().toString());
        // console.log("lan: " +window.localStorage.getItem('Lan'));

    }
}
