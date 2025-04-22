import { Component } from '@angular/core';
import { UserAuth } from '../../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, TranslateModule],
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