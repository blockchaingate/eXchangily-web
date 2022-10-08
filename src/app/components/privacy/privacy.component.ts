import { Component } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  lan = 'en';
  constructor(private localSt: LocalStorage) {
    this.lan = localStorage.getItem('_lan') || 'en';
  }
}