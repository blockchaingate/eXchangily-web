import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../../../landing/service/user-auth/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../landing/service/user/user.service';
import { User } from '../../../../landing/models/user';
import { Merchant } from '../../../../../models/merchant';
import { MerchantService } from '../../../../../services/merchant.service';
import { observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import {StorageService} from '../../../../../services/storage.service';

@Component({
    selector: 'app-apply-as-merchant',
    templateUrl: './merchant-application.component.html',
    styleUrls: ['./merchant-application.component.css']
})
export class MerchantApplicationComponent implements OnInit {
    user: User;
    token: string;
    merchant: Merchant = new Merchant('', '');
    submited = false;
    msg = 'You applied merchant account already.';
    errMsg: string;

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
        private _mcServ: MerchantService) {}

    ngOnInit() {

        this.storageService.getToken().subscribe(
            (token:string) => {  
                this.token = token;
                this._userServ.getMe(token).subscribe(
                    (res: any) => {
                        console.log('ressss=', res);
                        if(res && res.ok) {
                            const body = res._body;
                            const defaultMerchant = body.defaultMerchant;
                            if(!defaultMerchant) {
                                return;
                            }
                            this.submited = true;
                            if (defaultMerchant.otcApproved) {
                                this._router.navigate(['/otc/otc-merchant']);
                            } else {
                                this.msg = 'Your merchant account is under review currently, please check later.';
                            }                            
                        } else {
                            this._router.navigate(['/login/signin', { retUrl: '/otc/otc-merchant/merchant-application'}]); 
                        }
                    }
                );
            }
        );






        /*
        if (!this._userAuth.token) {
            this._router.navigate(['/login/signin', { retUrl: '/otc/otc-merchant/merchant-application'}]);
        } else {
            this._userServ.getUserById(this._userAuth.id).subscribe(
                ret => {
                    console.log('ret===', ret);
                    this.user = <User>ret;
                    this.merchant.createMemberId = this.user._id;
                    if (this.user.merchants && this.user.merchants[0]) {
                        this.merchant = <Merchant>this.user.merchants[0];

                        this.submited = true;
                        if (this.merchant.otcApproved) {
                            this._router.navigate(['/otc/otc-merchant']);
                        } else {
                            this.msg = 'Your merchant account is under review currently, please check later.';
                        }
                    } else {
                        this._mcServ.find(this.user._id).subscribe(
                            rets => {
                                this.submited = true;
                                const merchants = <Merchant[]>rets;
                                if (merchants[0].otcApproved) {
                                    this._router.navigate(['/otc/otc-merchant']);
                                } else {
                                    this.msg = 'Your merchant account is under review currently, please check later.';
                                }        
                            },
                            err => {}
                        );
                    }
                },
                err => { this.errMsg = err.message; }
            );
        }
        */
    }

    onSubmit() {
        /*
        this.merchant.name = this.merchantForm.get('merchantName').value;
        this.merchant.phone = this.merchantForm.get('phone').value;
        this.merchant.email = this.merchantForm.get('email').value;
        */
        const merchant = {
            name: this.merchantForm.get('merchantName').value,
            phone: this.merchantForm.get('phone').value,
            email: this.merchantForm.get('email').value
        };

        this._mcServ.create(this.token, merchant).subscribe(
            res => {  // this._router.navigate(['/otc/otc-merchant/waitting']);
                     this.submited = true;
                     this.msg = 'You have submited application successful, please waiting for review, it may take 3~5 business days.';
                    },
            err => { this.errMsg = err.message || err; }
        );
    }

    onClose() {
        this._router.navigate(['/otc/trade']);
    }

}


