import { Component, OnInit, ViewChild } from '@angular/core';
import { OtcPlaceOrderModal } from '../../modals/otc-place-order/otc-place-order';
import { ApplyForMerchantModal } from '../../modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from '../../modals/confirm-payment/confirm-payment';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';

export interface PeriodicElement {
  Merchant: string;
  PaymentMethod: string[];
  Quantity: number;
  LimitsLow: number;
  LimitsHigh: number;
  Price: number;
  Currency: string;
  BidOrAsk: boolean;
  CoinName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Merchant: '闪闪电波波商行', 
    PaymentMethod: ['alipay'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'USD',
    BidOrAsk: true, 
    CoinName: 'USDT'
  },
  {
    Merchant: '奶粉大王', 
    PaymentMethod: ['alipay'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'USD',
    BidOrAsk: true, 
    CoinName: 'USDT'
  },
  {
    Merchant: '全全天在线~秒放币~秒放款', 
    PaymentMethod: ['alipay', 'bank'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'USD',
    BidOrAsk: true, 
    CoinName: 'USDT'
  },
  {
    Merchant: '诚信胖虎', 
    PaymentMethod: ['alipay'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'USD',
    BidOrAsk: true, 
    CoinName: 'USDT'
  },
  {
    Merchant: '光速~小宇哥', 
    PaymentMethod: ['alipay', 'bank'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'USD',
    BidOrAsk: false, 
    CoinName: 'USDT'
  },
  {
    Merchant: '外汇大王', 
    PaymentMethod: ['alipay', 'bank'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'CAD',
    BidOrAsk: true, 
    CoinName: 'USDT'
  }, 
  {
    Merchant: 'OTC Trader', 
    PaymentMethod: ['alipay', 'bank'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'CNY',
    BidOrAsk: false, 
    CoinName: 'USDT'
  },  
  {
    Merchant: '场外交易1', 
    PaymentMethod: ['alipay', 'bank'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'CNY',
    BidOrAsk: true, 
    CoinName: 'USDT'
  }, 
  {
    Merchant: '熊猫在线', 
    PaymentMethod: ['alipay', 'bank'], 
    Quantity: 4010.457, 
    LimitsLow: 7000.0, 
    LimitsHigh: 35764.23, 
    Price: 7.11, 
    Currency: 'CNY',
    BidOrAsk: false, 
    CoinName: 'USDT'
  },      
];


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  bidOrAsk: boolean;
  coinName: string;
  currency: string;
  currencies: string[] = [
    'USD',
    'CAD',
    'CNY'
  ];

  dataSource: any;

  @ViewChild('otcPlaceOrderModal', {static: true}) otcPlaceOrderModal: OtcPlaceOrderModal;
  @ViewChild('applyForMerchantModal', {static: true}) applyForMerchantModal: ApplyForMerchantModal;
  @ViewChild('confirmPaymentModal', {static: true}) confirmPaymentModal: ConfirmPaymentModal;
  constructor(private _router: Router,        
    private storageService: StorageService,
    private _otcServ: OtcService
  ) { }

  ngOnInit() {
    this.bidOrAsk = true;
    this.coinName = 'USDT';
    this.currency = 'USD';
    // this.dataSource = ELEMENT_DATA;
    this.dataSource = [];
    this._otcServ.getPublicListings().subscribe(
      (res: any) => {
          console.log('res from addListing=', res);
          if(res && res.ok) {
              this.dataSource = res._body;
              console.log('this.dataSource===', this.dataSource);
          }
      }
    );    
  }

  changeCoinName(bOrA: boolean, coin: string) {
    this.bidOrAsk = bOrA;
    this.coinName = coin;
  }

  placeOrder(element) {
    this.otcPlaceOrderModal.show(element);
  }

  onConfirmedPlaceOrder (event) {
    console.log('3');
    this.confirmPaymentModal.show();
    console.log('4');
  }

  becomeMerchant() {
    this._router.navigate(['/otc/otc-merchant/merchant-application']);
    // this.applyForMerchantModal.show();
  }

  placeAdv() {

  }
  
  onBecomeMerchant( event ) {
  }

  onConfirmPayment(event) {

  }
}
