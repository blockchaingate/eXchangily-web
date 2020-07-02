import { Component } from '@angular/core';

import { setTheme } from 'ngx-bootstrap/utils';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigService } from './services/config.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selected = 1;
  noHeader = false;
  flag = 'flag_zh.svg';
  msg: string;
  currentLang: string;
  darkBgEnable: boolean;
  constructor(private route: ActivatedRoute, private configServ: ConfigService, router: Router) {
    setTheme('bs4'); // Bootstrap 4
    this.darkBgEnable = false;
    // const url = window.location.href;



    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.url;
        if (
          (url.indexOf('/market') >= 0)
          || (url.indexOf('/launchpad') >= 0)
          || (url.indexOf('/wallet') >= 0) 
          || (url.indexOf('/explorer') >= 0) 
          || (url.indexOf('/smartcontract') >= 0)
        ) {
          this.darkBgEnable = true;
        } else {
          this.darkBgEnable = false;
        }
      }
    });

    /*
    if (url.indexOf('noHeader=true') >= 0) {
      this.noHeader = true;
    }
    */
    /*
    console.log('urllll=', url);
    if (this.route.snapshot.queryParamMap.get('noHeader')) {
      if (this.route.snapshot.queryParamMap.get('noHeader') === 'true') {
        this.noHeader = true;
      } else {
        this.noHeader = false;
      }
      console.log('this.noHeader=', this.noHeader);
    }
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.url;

      }
    });
    */
  } 


}
