import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WsService } from './services/ws.service';
import { ApiService } from './services/api.service';

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
  blocked: boolean;
  private isMobile: boolean;
 

  constructor(
    private apiServ: ApiService,
    private route: ActivatedRoute,
    private wsService: WsService,
    router: Router) {
    setTheme('bs4'); // Bootstrap 4
    this.darkBgEnable = false;
    this.blocked = false;
    this.isMobile = this.isMobileDevice();
    // const url = window.location.href;
    this.apiServ.checkCountry().subscribe(
      (countryCode: string) => {
        console.log('countryCode===', countryCode);
        if(['CA'].indexOf(countryCode) >= 0) {
          this.blocked = true;
        }
      }
    );
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

  private isMobileDevice(): boolean {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      console.log('User is accessing from a mobile browser.');
      this.wsService.connectSocketDapp();

    } else {
      console.log('User is accessing from a laptop or desktop browser.');
    }

    return isMobile;
  }

  getisMobile(): boolean {
    return this.isMobile;
  }


}
