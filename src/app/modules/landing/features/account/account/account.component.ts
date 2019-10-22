import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountPaths } from '../../../paths/account-paths';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { AppService } from '../../../service/app-service/app.service';
import { Application } from '../../../models/application';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  navPaths = AccountPaths;
  isAdmin = false;

  constructor(private _userAuthServ: UserAuth, private _appServ: AppService, private _rout: Router) {}

  ngOnInit() {
    this._appServ.getApp().subscribe(
      (ret: any) => {
        if (ret.appAdmin === this._userAuthServ.email) {
          this.isAdmin = true;
        }
      },
      err => {}
    );
  }

  logout() {
    this._userAuthServ.id = '';
    this._userAuthServ.email = '';
    this._userAuthServ.token = '';
    this._userAuthServ.logout();
    this._rout.navigate(['/']);
  }
}
