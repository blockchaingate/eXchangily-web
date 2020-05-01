import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  bidOrAsk: boolean;
  statuses = [];
  @Input() orders: any;
  token: string;
  buyOrderStatuses = ['Waiting for pay', 'Paid already', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  sellOrderStatuses = ['Waiting for collect', 'Waiting for confirm', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  currentStatus: string;
  constructor(     
    private router: Router,   
    private storageService: StorageService,
    private _otcServ: OtcService
  ) { }

  getStatusText(status: number) {
    let text = '';
    if(status === 0) {
      text = 'Waiting for pay';
    } else 
    if(status === 1) {
      text = 'Paid already';
    } else 
    if(status === 2) {
      text = 'Finished';
    } else 
    if(status === 3) {
      text = 'Cancelled';
    } else 
    if(status === 4) {
      text = 'Frozened';
    } 
    return text;               
  } 

  confirmedPaid(element) {
    this._otcServ.confirmedOrderPaid(this.token, element._id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          element.paymentStatus = 1;
        }
      }
    );
  }

  ngOnInit() {
    this.bidOrAsk = true;
    this.statuses = this.buyOrderStatuses;
    this.currentStatus = this.statuses[0];

    this.storageService.getToken().subscribe(
      (token: string) => {
          this.token = token;
          /*
          this._otcServ.getOrders(this.token).subscribe(
              (res: any) => {
                  if(res) {
                    const ok = res.ok;
                    const data = res._body;
                    if(ok) {
                      this.orders = data;
                    } else {
                      if(data && data.name == 'TokenExpiredError') {
                        this.router.navigate(['/login/signin', { 'retUrl': '/otc/order' }]);
                      }
                    }
                  }
              }
          );
          */
      }
  );    

  }

  changeBidOrAsk(b: boolean) {
    this.bidOrAsk = b;
    if (b) {
      this.statuses = this.buyOrderStatuses;
    } else {
      this.statuses = this.sellOrderStatuses;
    }
    this.currentStatus = this.statuses[0];
  }

  changeStatus(status: string) {
    this.currentStatus = status;
  }
}
