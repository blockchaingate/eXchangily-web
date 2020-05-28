import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../../services/storage.service';
import { OtcService } from '../../../../../../services/otc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    token: string;
    orders: any;
    constructor(
      private router: Router,
      private otcServ: OtcService, 
      private _storageServ: StorageService        
    ) {}    
    ngOnInit() {
      this._storageServ.getToken().subscribe(
        (token: string) => {
          this.token = token;
          this.otcServ.getAllOrders(this.token).subscribe(
            (res: any) => {
              if (res) {
                const ok = res.ok;
                const data = res._body;
                if (ok) {
                  this.orders = data;
                } else {
                  if (data && data.name === 'TokenExpiredError') {
                    this.router.navigate(['/login/signin', { 'retUrl': '/admin/otc-orders' }]);
                  }
                }
              }
            }
          );
        }
      );
    }
}