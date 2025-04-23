import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-orders',
  templateUrl: './merchant-orders.html',
  styleUrls: ['./merchant-orders.css']
})
export class MerchantOrdersComponent implements OnInit {
  token: string;
  orders: any;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private _otcServ: OtcService
  ) { }

  ngOnInit() {

    this.storageService.getToken().subscribe(
      (token: any) => {
        this.token = token;
        this._otcServ.getMerchantOrders(this.token).subscribe(
          (res: any) => {
            if (res) {
              const ok = res.ok;
              const data = res._body;
              if (ok) {
                this.orders = data;
              } else {
                if (data && data.name === 'TokenExpiredError') {
                  this.router.navigate(['/login/signin', { 'retUrl': '/otc/merchant-orders' }]);
                }
              }
            }
          }
        );
      }
    );

  }
}
