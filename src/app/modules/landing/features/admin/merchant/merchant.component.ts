import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../service/app-service/app.service';
import { AppAuthService } from '../../../service/app-auth/app-auth.service';
import { Application } from '../../../models/application';
import { MerchantService } from '../../../../../services/merchant.service';

@Component({
  selector: 'app-admin-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  merchants: any;

  constructor(private merchantServ: MerchantService, private _appServ: AppService, private _appAuth: AppAuthService) { }
  ngOnInit() {
    this.merchantServ.getAll().subscribe(
      (res: any) => {
        console.log('res==', res);
        if (res && res.ok) {
          this.merchants = res._body;
        }
      }
    );
  }

  approve(merchant) {
    this.merchantServ.approve(merchant._id).subscribe(
      (res: any) => {
        if (res.ok) {
          for (let i = 0; i < this.merchants.length; i++) {
            if (this.merchants[i]._id === merchant._id) {
              this.merchants[i].otcApproved = true;
              break;
            }
          }
        }
      }
    );
  }
}
