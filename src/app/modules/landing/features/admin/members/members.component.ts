import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  token: string;
  members: any;

  constructor(private _storageServ: StorageService, private _userServ: UserService) { }

  ngOnInit() {
    this._storageServ.getToken().subscribe(
      (token: any) => {
        // console.log('token=', token);
        this.token = token;
        this._userServ.getAllInactiveUsers(token).subscribe(
          (res: any) => {
            console.log('res for all Users=', res);
            if (res && res.ok) {
              this.members = res._body;
            }
          }
        );
      }
    );
  }

  confirmActive(member: any) {
    this._userServ.setActive(member._id, this.token).subscribe(
      (res: any) => {
        if (res && res.ok) {
          member.active = true;
        }
      }
    );
  }
}
