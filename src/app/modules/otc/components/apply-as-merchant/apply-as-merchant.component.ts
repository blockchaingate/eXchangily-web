import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../../landing/service/user-auth/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../landing/service/user/user.service';
import { User } from '../../../landing/models/user';
import { Merchant } from '../../../../models/merchant';
import { MerchantService } from '../../../../services/merchant.service';
import { observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-apply-as-merchant',
    templateUrl: './apply-as-merchant.component.html',
    styleUrls: ['./apply-as-merchant.component.css']
})
export class ApplyAsMerchantComponent implements OnInit {
    user: User;
    merchant: Merchant = new Merchant('', '');
    errMsg: string;

    merchantForm = new FormGroup({
        merchantName: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
      });

    constructor(private _router: Router, private _userAuth: UserAuth, private _userServ: UserService, private _mcServ: MerchantService) {}

    ngOnInit() {
        if (!this._userAuth.token) {
            this._router.navigate(['/login/signin']);
        } else {
            this._userServ.getUserById(this._userAuth.id).subscribe(
                ret => {
                    this.user = <User>ret;
                    if (this.user.merchants && this.user.merchants[0]) {
                        this.merchant = <Merchant>this.user.merchants[0];
                    }
                },
                err => { this.errMsg = err.message; }
            );
        }
    }

    onSubmit() {
        this.merchant.name = this.merchantForm.get('merchantName').value;
        this.merchant.phone = this.merchantForm.get('phone').value;
        this.merchant.email = this.merchantForm.get('email').value;

        this._mcServ.create(this.merchant).subscribe(
            res => { alert((<Merchant>res)._id); },
            err => {}
        );
    }
}


