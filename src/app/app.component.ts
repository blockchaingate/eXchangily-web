import { Component } from '@angular/core';

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

  constructor( private configServ: ConfigService) {
    setTheme('bs4'); // Bootstrap 4

    this.year = (new Date()).getFullYear();
  }


}
