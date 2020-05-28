import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertService } from '../../../../services/alert.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'otc-place-order-error-modal',
    templateUrl: './otc-place-order-error.component.html',
    styleUrls: ['./otc-place-order-error.component.scss']
})
export class OtcPlaceOrderErrorModal implements OnInit {
    errorReson: string;
    token: string;
    exgAddress: string;
    btcAddress: string;
    ethAddress: string;
    updated: boolean;
    lan: string;

   
    @ViewChild('otcPlaceOrderErrorModal', { static: true }) public otcPlaceOrderErrorModal: ModalDirective;

    constructor(
        private router: Router,
        private userServ: UserService,
        private alertServ: AlertService,
      ) { }    
    ngOnInit() {
        this.lan = localStorage.getItem('Lan');
        this.updated = false;
    }
    show(errorReson) {
        this.errorReson = errorReson;
        this.otcPlaceOrderErrorModal.show();
    }
    showEx(errorReson, token, exgAddress, btcAddress, ethAddress) {
        this.errorReson = errorReson;
        this.token = token;
        this.exgAddress = exgAddress;
        this.btcAddress = btcAddress;
        this.ethAddress = ethAddress;
        this.otcPlaceOrderErrorModal.show();
    }
    hide() {
        this.otcPlaceOrderErrorModal.hide();
    }   
    
    updateAdd() {
        console.log('this.exgAddress=', this.exgAddress);
        if (!this.exgAddress) {
          if (this.lan === 'zh') {
            this.alertServ.openSnackBar('没有EXG地址', 'Ok');
          } else {
            this.alertServ.openSnackBar('EXG address not found', 'Ok');
          }
          return;
        }
        this.userServ.importAllAddresses(this.token, this.exgAddress, this.btcAddress, this.ethAddress).subscribe(
          (res: any) => {
            console.log('res=', res);
            if (res.ok) {
              this.updated = true;
              if (this.lan === 'zh') {
                this.alertServ.openSnackBar('地址已更新', 'Ok');
              } else {
                this.alertServ.openSnackBar('Addresses was updated', 'Ok');
              }
            } else {
              this.router.navigate(['/login/signin', { 'retUrl': '/otc/trade' }]);
            }
          }
        );
      }    
}