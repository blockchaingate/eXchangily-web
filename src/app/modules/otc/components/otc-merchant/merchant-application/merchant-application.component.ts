import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../../../landing/service/user-auth/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../landing/service/user/user.service';
import { User } from '../../../../landing/models/user';
import { Merchant } from '../../../../../models/merchant';
import { MerchantService } from '../../../../../services/merchant.service';
import { observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { StorageService } from '../../../../../services/storage.service';

@Component({
    selector: 'app-apply-as-merchant',
    templateUrl: './merchant-application.component.html',
    styleUrls: ['./merchant-application.component.css']
})
export class MerchantApplicationComponent implements OnInit {
    user: User = {} as User;
    token = '';
    merchant: Merchant = new Merchant('', '');
    submited = false;
    msg = 'You applied merchant account already.';
    errMsg = '';
    lan: any = 'en';

    merchantForm = new FormGroup({
        merchantName: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
    });

    constructor(
        private storageService: StorageService,
        private _router: Router,
        private _userAuth: UserAuth,
        private _userServ: UserService,
        private _mcServ: MerchantService) { }

    ngOnInit() {
        console.log('init in application');
        this.lan = localStorage.getItem('Lan');
        this.storageService.getToken().subscribe(
            (token: any) => {
                this.token = token;
                console.log('token==', token);
                this._userServ.getMe(token).subscribe(
                    (res: any) => {
                        if (res && res.ok) {
                            const body = res._body;
                            const defaultMerchant = body.defaultMerchant;
                            if (!defaultMerchant) {
                                return;
                            }
                            this.submited = true;
                            if (defaultMerchant.otcApproved) {
                                // this._router.navigate(['/otc/otc-merchant']);
                            } else {
                                if (this.lan === 'zh') {
                                    this.msg = '您的商户申请正在审核，请耐心等候。';
                                } else {
                                    this.msg = 'Your merchant account is under review currently, please check later.';
                                }
                            }
                        } else {
                            // this._router.navigate(['/login/signin', { retUrl: '/otc/otc-merchant/merchant-application' }]);
                        }
                    },
                    (error) => {
                        console.log('error there we go', error);
                    }
                );
            }
        );

    }

    onSubmit() {
        const merchant: any = {
            name: this.merchantForm.get('merchantName')?.value,
            phone: this.merchantForm.get('phone')?.value,
            email: this.merchantForm.get('email')?.value
        };

        this._mcServ.create(this.token, merchant).subscribe(
            res => {  // this._router.navigate(['/otc/otc-merchant/waitting']);
                this.submited = true;
                if (this.lan === 'zh') {
                    this.msg = '您的申请已经成功提交，需要3~5个工作日审核，请耐心等候。';
                } else {
                    this.msg = 'You have submited application successful, please waiting for review, it may take 3~5 business days.';
                }
            },
            err => { this.errMsg = err.message || err; }
        );
    }

    onClose() {
        this._router.navigate(['/otc/trade']);
    }

}


