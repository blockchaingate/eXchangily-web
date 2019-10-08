import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../service/user/user.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-kycs-admin',
  templateUrl: './kycs.component.html',
  styleUrls: ['./kycs.component.css']
})
export class KycsComponent implements OnInit {
  users: User[];
  email = '';
  selectedValue = 1;
  states = [
      {value: 0, name: 'none'},
      {value: 1, name: 'in process'},
      {value: 3, name: 'failure'},
      {value: 100, name: 'passed'},
    ];
  msg: string;

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router,
    private _userServ: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this._userServ.getUsers({kyc: 1}).subscribe (
      ret => this.users = ret,
      err => this.msg = err
    );
  }

  ChangeValue(event) {
    this._userServ.getUsers({kyc: this.selectedValue}).subscribe (
      ret => this.users = ret,
      err => this.msg = err
    );
  }

  onSearch() {
    if (this.email) {
      this._userServ.getUsers({email: this.email}).subscribe (
        ret => this.users = ret,
        err => this.msg = err
      );
    }
  }

  select(user: User) {
    this._router.navigate(['/account/admin/kyc', user._id]);
  }
}
