import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { OtcService } from '../../../../../services/otc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-otc-order',
  templateUrl: './my-otc-order.component.html',
  styleUrls: ['./my-otc-order.component.scss']
})
export class MyOtcOrderComponent implements OnInit {
  token = '';
  orders: any;

  constructor(private router: Router, private otcServ: OtcService, private _storageServ: StorageService) { }

  ngOnInit() {
    this._storageServ.getToken().subscribe(
      (token: any) => {
        this.token = token;
        this.otcServ.getOrders(this.token).subscribe(
          (res: any) => {
            if (res) {
              const ok = res.ok;
              const data = res._body;
              console.log('res for getAllOrders=', res);
              if (ok) {
                this.orders = data;
              } else {
                if (data && data.name === 'TokenExpiredError') {
                  this.router.navigate(['/login/signin', { 'retUrl': '/admin/otc-orders' }]);
                }
              }
            }
          },
          (error: any) => {
            this.orders = [];
          }
        );
      }
    );
  }
}