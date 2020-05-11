import { Component, OnInit, ViewChild } from '@angular/core';
import { OtcPlaceOrderModal } from '../../modals/otc-place-order/otc-place-order';
import { ApplyForMerchantModal } from '../../modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from '../../modals/confirm-payment/confirm-payment';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  bidOrAsk: boolean;
  coinName: string;
  currency: string;
  token: string;
  element: any;
  currencies: string[] = [
    'USD',
    'CAD',
    'CNY'
  ];

  dataSource: any;

  @ViewChild('otcPlaceOrderModal', { static: true }) otcPlaceOrderModal: OtcPlaceOrderModal;
  @ViewChild('applyForMerchantModal', { static: true }) applyForMerchantModal: ApplyForMerchantModal;
  @ViewChild('confirmPaymentModal', { static: true }) confirmPaymentModal: ConfirmPaymentModal;

  constructor(private _router: Router, private storageService: StorageService, private _otcServ: OtcService) { }

  ngOnInit() {
    this.bidOrAsk = true;
    this.coinName = 'USDT';
    this.currency = 'USD';
    // this.dataSource = ELEMENT_DATA;
    this.dataSource = [];
    this._otcServ.getPublicListings().subscribe(
      (res: any) => {
        console.log('res from addListing=', res);
        if (res && res.ok) {
          this.dataSource = res._body;
          console.log('this.dataSource===', this.dataSource);
        }
      }
    );

    this.storageService.getToken().subscribe(
      (token: string) => {
        this.token = token;
        if (!this.token) {
          this._router.navigate(['/login/signin', { 'retUrl': '/otc/trade' }]);
        }
      });
  }

  changeCoinName(bOrA: boolean, coin: string) {
    this.bidOrAsk = bOrA;
    this.coinName = coin;
  }

  placeOrder(element) {
    this.element = element;
    this.otcPlaceOrderModal.show(element);
  }

  onConfirmedPlaceOrder(event) {

    console.log('event=', event);
    this._otcServ.addOrder(this.token, this.element._id, event).subscribe(
      (res: any) => {
        console.log('res for addOrder=', res);
        if (res.ok) {
          const data = res._body;
          this.element = data;
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i]._id == this.element._id) {
              this.dataSource[i].qtyAvilable = this.element.qtyAvilable;
            }
          }
        }
      }
    );

  }

  becomeMerchant() {
    this._router.navigate(['/otc/otc-merchant/merchant-application']);
    // this.applyForMerchantModal.show();
  }

  placeAdv() {

  }

  onBecomeMerchant(event) {
  }

  onConfirmPayment(event) {

  }
}
