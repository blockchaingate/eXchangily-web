import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

const whitepaperPath = './assets/pdfs/wp';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  whitepaper: string;
  lang: string;
  private subscribers: Array<Subscription> = [];

  constructor(private _translate: TranslateService) { }

  ngOnInit() {
    this.getLang();

    this.subscribers.push(
      this._translate.onLangChange
      .subscribe((event: LangChangeEvent) => {
        this.getLang(event.lang);
      })
    );
  }

  private getLang(language = ''): string {
    const lang = language || this._translate.currentLang || window.localStorage.getItem('fabLanguagei18n');
    this.lang = lang;
    this.whitepaper = `${whitepaperPath}-${lang}.pdf`;
    return lang;
  }
}
