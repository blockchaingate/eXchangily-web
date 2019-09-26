import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLang: string;
  @Output() public sidenavToggle = new EventEmitter();
  background: string;
  constructor(private translate: TranslateService, private router: Router, private location: Location) { }
 
  ngOnInit() {
    this.currentLang = 'English';
    this.translate.setDefaultLang('en');
    this.setLan();   
    this.background = 'dark-back';
    const path = this.location.path();
    if (path.indexOf('/home') >= 0 || path.indexOf('/login') >= 0) {
      this.background = 'gradient-back-title';
    }
  }
 
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  linkTo(url: string) {
    this.router.navigate([url]);
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
  
    this.translate.use(lang.toLowerCase());
  }

  selectLan(lan: string) {
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
