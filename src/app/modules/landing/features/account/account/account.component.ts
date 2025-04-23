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
  navPaths: any;
  isAdmin = false;
  constructor(private _userAuthServ: UserAuth, private _appServ: AppService, private _rout: Router) {}

  ngOnInit() {
    console.log('hasMerchant=', this._userAuthServ.hasMerchant);
    if(this._userAuthServ.hasMerchant) {
      this.navPaths = AccountPaths;
    } else {
      this.navPaths = AccountPaths.filter(item => !item.merchantOnly);
    }
    
    this._appServ.getApp().subscribe(
      (res: Application) => {
        if (res.appAdmin === this._userAuthServ.email) {
          this.isAdmin = true;
        }
      },
      err => err
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
