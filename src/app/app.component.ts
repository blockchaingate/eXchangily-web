import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Config } from './models/config';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selected = 1;
  year = 2018;
  flag = 'flag_zh.svg';
  msg: string;
  currentLang: string;

  constructor(private translate: TranslateService, private configServ: ConfigService) {
    setTheme('bs4'); // Bootstrap 4
    this.currentLang = 'English';
    translate.setDefaultLang('en');
    this.setLan();
    this.year = (new Date()).getFullYear();
  }

  setLan() {
    let lang = window.localStorage.getItem('Lan');

    if (!lang) {
      lang = navigator.language;
      lang = lang.substr(0, 2);
      if (lang === 'CN' || lang === 'cn') { lang = 'zh'; }
      localStorage.setItem('Lan', lang.toLowerCase());
    } else {
      if (lang === 'CN' || lang === 'cn') { lang = 'zh'; }
    }
  
    this.flag = 'flag_' + lang + '.svg';
    this.translate.use(lang.toLowerCase());
  }

  selectLan(lan: string) {
    this.flag = 'flag_' + lan + '.svg';
    window.localStorage.setItem('Lan', lan);
    this.translate.use(lan);
    if (lan === 'en') {
      this.currentLang = 'English';
    } else 
    if (lan === 'zh') {
      this.currentLang = '中文';
    }
  }
}
