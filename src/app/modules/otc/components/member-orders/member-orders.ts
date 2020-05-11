import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-orders',
  templateUrl: './member-orders.html',
  styleUrls: ['./member-orders.css']
})
export class MemberOrdersComponent implements OnInit {
  token: string;
  orders: any;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private _otcServ: OtcService
  ) { }

  ngOnInit() {

    this.storageService.getToken().subscribe(
      (token: string) => {
        this.token = token;
        this._otcServ.getOrders(this.token).subscribe(
          (res: any) => {
            if (res) {
              const ok = res.ok;
              const data = res._body;
              if (ok) {
                this.orders = data;
              } else {
                if (data && data.name === 'TokenExpiredError') {
                  this.router.navigate(['/login/signin', { 'retUrl': '/otc/order' }]);
                }
              }
            }
          }
        );
      }
    );

  }
}
