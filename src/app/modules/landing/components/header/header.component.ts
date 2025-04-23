import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserAuth } from '../../service/user-auth/user-auth.service';
import { AccountPaths } from '../../paths/account-paths';
import { languages } from '../../app.constants';

import { DropdownData } from '../../models/dropdown-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  languages = languages;
  currentLang: string;

  accountPaths = AccountPaths;
  userName: string;
  language: string;
  loggedIn = false;
  accountDropDown: Array<DropdownData> = [];

  private subscribers: Array<Subscription> = [];

  constructor(private _userAuth: UserAuth, private _router: Router, private _translate: TranslateService) {}

  ngOnInit() {
    this.setCurrentLang();
    this.languageInit();
    this.subscribers.push(
      this._userAuth.isLoggedIn$
      .subscribe((value: string) => {
        console.log('value: ' + value);
        this.loggedIn = value ? true : false;
        alert(this.loggedIn);
      }),
      this._userAuth.userDisplay$
      .subscribe((value: string) => {
        this.userName = value;
      }),
      this._translate.onLangChange
      .subscribe((event: LangChangeEvent) => {
        this.setCurrentLang(event.lang);
        this.languageInit();
      })
    );
  }

  langToggle(lang) {
    this._translate.use(lang);
    window.localStorage.setItem('Lan', lang);
    this.setCurrentLang(lang);
  }

  selectorNavTo(navTo: string) {
    this._router.navigate([navTo]);
  }

  private setCurrentLang(language = '') {
    this.currentLang = language || this._translate.currentLang || window.localStorage.getItem('Lan');

    if (!this.currentLang) {
      if (navigator.language.includes('zh')) {
        this.currentLang = '中文';
      } else {
        this.currentLang = 'English';
      }
    } else {
      if (this.currentLang.includes('zh') || this.currentLang.includes('cn')) {
        this.currentLang = '中文';
      } else {
        this.currentLang = 'English';
      }
    }
    this.currentLang = (this.currentLang) ? this.currentLang.toLocaleUpperCase() : this.currentLang;
  }

  private languageInit() {
    let translations = ['Header.Language'];
    translations = translations.concat(this.accountPaths.map(a => a.i18n));

    this._translate.get(translations)
      .subscribe((ret) => {
        this.accountDropDown = [];
        this.language = ret['Header.Language'];
        for (let i = 0; i < this.accountPaths.length; i++) {
          this.accountDropDown.push({
            text: ret[this.accountPaths[i].i18n],
            value: this.accountPaths[i].absolute
          });
        }
      });
  }

  logout() {
    this._userAuth.id = '';
    this._userAuth.email = '';
    this._userAuth.token = '';
    this._userAuth.logout();
    this._router.navigate(['/']);
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].unsubscribe();
    }
  }
}
