import { Component } from '@angular/core';

import { setTheme } from 'ngx-bootstrap/utils';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selected = 1;
  
  flag = 'flag_zh.svg';
  msg: string;
  currentLang: string;
  darkBgEnable: boolean;
  constructor( private configServ: ConfigService, router: Router) {
    setTheme('bs4'); // Bootstrap 4
    this.darkBgEnable = false;
    

    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.url;
        if ((url.indexOf('/market') >= 0) || (url.indexOf('/wallet') >= 0) || (url.indexOf('/explorer') >= 0)) {
          this.darkBgEnable = true;
        } else {
          this.darkBgEnable = false;
        }
      }
    });
  }


}
