import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountPaths } from '../../../paths/account-paths';

import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { AppUsersService } from '../../../service/app-users/app-users.service';
import { UserService } from '../../../service/user/user.service';
import { IcotxService } from '../../../service/icotx/icotx.service';
import { User } from '../../../models/user';
import { Icotx } from '../../../models/icotx';
import { AppUsers } from '../../../models/app-users';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  user: User = { email: '' };

  edit = false;
  errorMessage = '';
  activeStatus = 'clear';
  personalUser = 'done';
  parentReferralCode = '';
  data: any;
  totalTokens = 0;

  returnAdd = '';
  loadingDone = false;

  constructor(
    private _userAuth: UserAuth,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _appUsers: AppUsersService,
    private _icotx: IcotxService
  ) { }

  ngOnInit() {
    // get user data
    this.data = this._route.snapshot.data['appUser'];
    this.getUser(this._userAuth.id, this.data ? this.data.parentReferralCode : '');
    this.getAllOrders();
  }

  setEdit() {
    this.edit = true;
  }

  getUser(id: number | string, parentReferral: string) {
    console.log('getUser=', id);
    this._userService.getUserById(id).subscribe(
      (ret: any) => {
        this.processRetGetUser(ret);
        const parentReferralCodeParam: any = { value: parentReferral, disabled: parentReferral };
        // build form
        this.userForm = new FormGroup({
          'email': new FormControl(this.user.email, [
            Validators.required,
            Validators.email
          ]),
          'displayName': new FormControl(this.user.displayName, []),
          'firstName': new FormControl(this.user.firstName, []),
          'midName': new FormControl(this.user.midName, []),
          'lastName': new FormControl(this.user.lastName, []),
          'homePhone': new FormControl(this.user.homePhone, []),
          'workPhone': new FormControl(this.user.workPhone, []),
          'mobile': new FormControl(this.user.mobile, []),
          'walletExgAddress': new FormControl(this.user.walletExgAddress, []),
          'workEmail': new FormControl(this.user.workEmail, []),
          'parentReferralCode': new FormControl(parentReferralCodeParam, [])
        });
        this.loadingDone = true;
      },
      error => this.processError(error)
    );
  }

  gotoUserUpdate() {
    this.user = {
      ...this.user,
      email: this.userForm.get('email')?.value,
      displayName: this.userForm.get('displayName')?.value,
      firstName: this.userForm.get('firstName')?.value,
      midName: this.userForm.get('midName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      homePhone: this.userForm.get('homePhone')?.value,
      workPhone: this.userForm.get('workPhone')?.value,
      mobile: this.userForm.get('mobile')?.value,
      walletExgAddress: this.userForm.get('walletExgAddress')?.value,
      workEmail: this.userForm.get('workEmail')?.value
    };

    this._userService.updateUser(this.user).subscribe(
      (ret: any) => { this.processRet(ret); },
      error => this.processError(error)
    );

    const prefcode = this.userForm.get('parentReferralCode');
    if (prefcode && prefcode.value && prefcode.value.length > 3) {
      let appUsers: AppUsers = { parentReferralCode: prefcode.value } as AppUsers;
      this._appUsers.updateAppUserById(this._userAuth.id, appUsers)
        .subscribe(res_ => {
          this.userForm.get('parentReferralCode')?.disable();
        });
    }
  }

  getAllOrders() {
    this._icotx.findIcotxes(this._userAuth.id, this.data ? this.data.email : '', '', '', '')
      .subscribe(res => {
        const orders = <Icotx[]>res;
        orders.forEach(ord => {
          if (ord.status === 'completed') {
            this.totalTokens += ord.totalAppTokens ?? 0;
          }
        });
      });
  }

  onCancel() {
    const ref = this.userForm.get('parentReferralCode')?.value;
    this.userForm.reset();
    this.userForm.get('parentReferralCode')?.setValue(ref);
    this.edit = false;
  }

  processError(error: any) {
    this.errorMessage = 'Error when retrieve user information.';
  }

  processRetGetUser(ret: User) {
    this.errorMessage = '';
    this.edit = false;

    this.user = ret;
    if (this.user.active) {
      this.activeStatus = 'done';
    }
    if (!this.user.personalMember) {
      this.personalUser = 'clear';
    }
  }

  processRet(ret: User) {
    this.errorMessage = '';
    this.edit = false;
    const displayAs = this.user.displayName || this.user.email;
    this._userAuth.userDisplay$.next(displayAs);
  }
}