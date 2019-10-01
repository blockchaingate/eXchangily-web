import { Component, OnInit, OnDestroy } from '@angular/core';

import { TranslateService} from '@ngx-translate/core';
import { JsonFileService } from '../../../service/jsondata/jsondata.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  team: Array<any> = [];
  open = false;
  doneLoading = false;
  private subscribers: Array<Subscription> = [];

  constructor(private _jsonData: JsonFileService, private _translate: TranslateService) { }

  ngOnInit() {
    this.getTeam().subscribe(res => {
      console.log('res=', res);
      this.team = res;
    });

    this.subscribers.push(
      this._translate.onLangChange
      .pipe(
        mergeMap(res => this.getTeam(res.lang))
      )
      .subscribe(members => {
        this.team = members;
      })
    );
  }

  toggleTeam() {
    this.open = !this.open;
  }

  private getTeam(language = ''): Observable<any> {
    const lang = language || this._translate.currentLang || window.localStorage.getItem('fabLanguagei18n');
    console.log('lang=' + lang);
    return this._jsonData.getJsonFile('./assets/i18n/' + lang + '.json')
    .map((res: any) => {
      console.log('res is', res);
      const members = [];

      for (const key in res.Home.Team.TeamMembers) {
        if (key) {
          members.push(res.Home.Team.TeamMembers[key]);
        }
      }
      this.doneLoading = true;
      return members;
    });
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].unsubscribe();
    }
  }
}
