import { Component, OnInit } from '@angular/core';
import { CoinOrderService } from '../../../service/coinorder/coinorder.service';
import { StorageService } from '../../../../../services/storage.service';
import { UtilService } from '../../../../../services/util.service';

@Component({
  selector: 'app-coin-orders',
  templateUrl: './coin-orders.component.html',
  styleUrls: ['./coin-orders.component.scss']
})
export class CoinOrdersComponent implements OnInit {
    orders: any;
    token: string;
    constructor(
      public utilServ: UtilService, 
      private coinorderServ: CoinOrderService, 
      private _storageServ: StorageService
    ) {}
    ngOnInit() {
        this._storageServ.getToken().subscribe(
          (token: string) => {
            this.token = token;
            this.coinorderServ.getAllOrders(token).subscribe(
              (res: any) => {
                console.log('res=', res);
                if(res.ok) {
                  this.orders = res._body;
                }
              }
            );
          }
        );
    }

    confirmOrder(order) {
      this.coinorderServ.confirmOrder(this.token, order._id).subscribe(
        (res: any) => {
          if(res.ok) {
          }
        }
      );
    }
}