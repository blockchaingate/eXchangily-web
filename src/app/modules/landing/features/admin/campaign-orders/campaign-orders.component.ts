import { Component, OnInit } from '@angular/core';
import { CampaignOrderService } from '../../../service/campaignorder/campaignorder.service';
import { StorageService } from '../../../../../services/storage.service';
import { UtilService } from '../../../../../services/util.service';

@Component({
  selector: 'app-campaign-orders',
  templateUrl: './campaign-orders.component.html',
  styleUrls: ['./campaign-orders.component.scss']
})
export class CampaignOrdersComponent implements OnInit {
    orders: any;
    token: string;
    constructor(
      public utilServ: UtilService, 
      private campaignorderServ: CampaignOrderService, 
      private _storageServ: StorageService
    ) {}
    ngOnInit() {
        this._storageServ.getToken().subscribe(
          (token: string) => {
            this.token = token;
            this.campaignorderServ.getAllOrders(token).subscribe(
              (res: any) => {
                console.log('res=', res);
                if(res.ok) {
                  this.orders = res._body;
                }
              },
              (error: any) => {
                this.orders = [];
              }
            );
          }
        );
    }
    
    getStatusText(status: number) {
      return this.campaignorderServ.getStatusText(status);
    }
    confirmOrder(order) {
      this.campaignorderServ.confirmOrder(this.token, order._id).subscribe(
        (res: any) => {
          if(res.ok) {
            order.status = '3';
          }
        }
      );
    }
}