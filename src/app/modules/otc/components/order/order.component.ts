import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  bidOrAsk: boolean;
  statuses = [];
  buyOrderStatuses = ['Waiting for pay', 'Paid already', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  sellOrderStatuses = ['Waiting for collect', 'Waiting for confirm', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  currentStatus: string;
  constructor() { }

  ngOnInit() {
    this.bidOrAsk = true;
    this.statuses = this.buyOrderStatuses;
    this.currentStatus = this.statuses[0];
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
