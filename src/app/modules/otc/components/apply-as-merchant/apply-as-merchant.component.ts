import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../../landing/service/user-auth/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../landing/service/user/user.service';
import { User } from '../../../landing/models/user';
import { Merchant } from '../../../../models/merchant';
import { MerchantService } from '../../../../services/merchant.service';
import { observable } from 'rxjs';

@Component({
    selector: 'app-apply-as-merchant',
    templateUrl: './apply-as-merchant.component.html',
    styleUrls: ['./apply-as-merchant.component.css']
})
export class ApplyAsMerchantComponent implements OnInit {
    user: User;
    merchant: Merchant = new Merchant('', '');
    errMsg: string;

    constructor(private _router: Router, private _userAuth: UserAuth, private _userServ: UserService) { }

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
        alert(this.merchant.name);
        alert(this.merchant.phone);
        alert(this.merchant.email);
    }
}
