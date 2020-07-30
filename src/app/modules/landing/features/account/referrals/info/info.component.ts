import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUsersService } from '../../../../service/app-users/app-users.service';
import { AppUsers } from '../../../../models/app-users';
import { UtilService } from '../../../../../../services/util.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  appUser: AppUsers;
  user;
  children;

  showCopySuccess = {
    link: false,
    code: false
  };

  constructor(
    private utilServ: UtilService,
    private _route: ActivatedRoute,
    private _appUsers: AppUsersService
  ) { }

  clipboard(val: string) {
    this.utilServ.copy(val);
  }
  
  ngOnInit() {
    this.appUser = this._route.snapshot.data.appUser;
    this.user = this._route.snapshot.data.user;
    
    this._appUsers.getChildReferrals(this.appUser.userId)
    .subscribe(
      ret => this.childLoaded(ret),
      error => this.childError(error)
    );
  }

  onCopiedSuccessfully(type: string) {
    if (this.showCopySuccess[type]) {
      return;
    }
    this.showCopySuccess[type] = true;
    setTimeout(() => {
      this.showCopySuccess[type] = false;
    }, 2500);
  }

  private childLoaded(res) {
    if (!res.success) {
      return;
    }
    this.children = res;
  }

  private childError(err) {
    console.log(err);
  }
}
