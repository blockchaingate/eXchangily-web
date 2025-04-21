import { Component } from '@angular/core';
import { UserAuth } from '../../modules/landing/service/user-auth/user-auth.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  lan = 'en';
  constructor(public userAuth: UserAuth) {
    // this.lan = localStorage.getItem('_lan') || 'en';
    this.lan = userAuth._lan;
  }
}