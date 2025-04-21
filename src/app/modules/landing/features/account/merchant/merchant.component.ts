import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  token = '';
  mobile = '';
  verificationCode = '';
  step = 0;
  merchant: any;
  member: any;
  constructor(
    private _router: Router,
    private storageService: StorageService,
    private userServ: UserService) { }

  ngOnInit() {

    this.storageService.getToken().subscribe(
      (token: any) => {
        this.token = token;
        console.log('token==', token);
        this.userServ.getMerchant(token).subscribe(
          (res: any) => {
            console.log('res for getMerchant=', res);
            if (res && res.ok) {
              const body = res._body;
              this.merchant = body.merchant,
                this.member = body.member;
            }
          });
      });
  }
}