import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otc-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  bidOrAsk: boolean;
  statuses = [0,1,2,3];
  @Input() orders: any;
  @Input() type: string;
  token: string;
  buyOrderStatuses = ['Waiting for pay', 'Paid already', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  buyOrderButtonStatuses = ['I have paid', 'Finish'];

  sellOrderStatuses = ['Waiting for collect', 'Waiting for confirm', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  sellOrderButtonStatuses = ['I have collected', 'Finish'];


  currentStatus: number;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private _otcServ: OtcService
  ) {
    console.log('type==', this.type);
  }
  getButtonText(buy: boolean, status: number) {
    buy = !buy;
    let text = '';
    if (buy && (status < this.buyOrderButtonStatuses.length)) {
      text = this.buyOrderButtonStatuses[status];
    } else
      if (!buy && (status < this.sellOrderButtonStatuses.length)) {
        text = this.sellOrderButtonStatuses[status];
      }
    return text;
  }
  
  getStatusText(buy: boolean, status: number) {
    buy = !buy;
    let text = '';
    if (buy) {
      text = this.buyOrderStatuses[status];
    } else {
      text = this.sellOrderStatuses[status];
    }
    return text;
  }

  changePaymentStatus(element, paymentStatus) {
    this._otcServ.changePaymentStatus(this.token, element._id, paymentStatus).subscribe(
      (res: any) => {
        if (res && res.ok) {
          element.paymentStatus = paymentStatus;
        }
      }
    );
  }

  ngOnInit() {
    this.bidOrAsk = true;
    // this.statuses = this.buyOrderStatuses;
    this.currentStatus = 0;

    this.storageService.getToken().subscribe(
      (token: string) => {
        this.token = token;

      }
    );

  }

  changeBidOrAsk(b: boolean) {
    this.bidOrAsk = b;

    this.currentStatus = this.statuses[0];
  }

  changeStatus(status: number) {
    this.currentStatus = status;
  }
}
