import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateOrderService } from '../../../../service/create-order/create-order.service';
import { CurrenciesService } from '../../../../service/currencies/currencies.service';
import { AccountPaths } from '../../../../paths/account-paths';
import { AppService } from '../../../../service/app-service/app.service';
import { Application } from '../../../../models/application';

import { Payment, Icotx } from '../../../../models/icotx';
import { Observable } from 'rxjs/Observable';
// import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit, OnDestroy {
  app: Application;
  totalUSD: number;
  paymethods = ['FAB', 'BTC', 'ETH', 'USD', 'CAD', 'RMB'];

  orderForm: FormGroup;
  payMethod = new FormControl('ETH', [Validators.required]);
  paidAmount = new FormControl(0, {
    validators: [
      Validators.required,
      Validators.min(0)
    ],
    updateOn: 'blur'
  });
  appTokenQty = new FormControl(0, {
    validators: [
      Validators.required,
      Validators.min(100)
    ],
    updateOn: 'blur'
  });
  payRate = new FormControl({value: '', disabled: true});

  constructor(private _createOrderService: CreateOrderService, private _router: Router,
              private _currenciesService: CurrenciesService, private _appServ: AppService) {}

  ngOnInit() {
    this.loadApp();

    const order: any = this._createOrderService.icotx || {};
    this.orderForm = new FormGroup({
      payMethod: this.payMethod,
      paidAmount: this.paidAmount,
      appTokenQty: this.appTokenQty,
      payRate: this.payRate
    });
    }

  loadApp() {
    this._appServ.getApp().subscribe(
      ret => this.app = ret,
      err => {}
    );
  }

  getAppCoinAddress(symbol: string) {
    this._createOrderService.appCoinSymbol = '';
    this._createOrderService.appCoinAddress = '';

    if (!this.app) {
      return;
    }

    for (let i = 0; i < this.app.coins.length; i++) {
      if (this.app.coins[i].symbol === symbol) {
        this._createOrderService.appCoinSymbol = symbol;
        this._createOrderService.appCoinAddress = '' + this.app.coins[i].add;
      }
    }
  }

  getPayMethod() {
    return this.orderForm.get('payMethod');
  }

  next() {
    const payMethod = ('' + this.orderForm.get('payMethod').value).toUpperCase();

    this.getAppCoinAddress(payMethod);

    if (!this.orderForm.valid && this.orderForm.get('paidAmount').value > 0) {
      return;
    }

    this._createOrderService.icotx = {
      payment: [this.orderForm.getRawValue()],
      // totalPaid: this.paidAmount.value,
      totalAppTokens: this.appTokenQty.value,
      totalPaid: this.totalUSD
    };
    this._router.navigate([AccountPaths[2].absolute, 'review']);
  }

  updateFromPayMethod() {
    const amount = this.orderForm.get('paidAmount').value;
    const payMethod = this.orderForm.get('payMethod').value;
    if (amount !== 0) {
      this._currenciesService.convertToEXC(amount, payMethod, false, false)
      .subscribe((result) => {
        const outcome = this.returnFixedNumber(result.conversion);
        this.orderForm.get('appTokenQty').setValue(outcome);
        this.orderForm.get('payRate').setValue(result.rate);
        this.totalUSD = result.amountUSD;
        // this.amountUSD.setValue(result.amountUSD);
      });
    }
  }

  updateFromQty() {
    const pm = this.orderForm.get('payMethod').value;
    const qty = this.orderForm.get('appTokenQty').value || 0;

    if (qty === 0) {
      this.orderForm.get('paidAmount').setValue(0);
    }

    this._currenciesService.convertToEXC(qty, pm, true, false)
    .subscribe((result) => {
      const outcome = this.returnFixedNumber(result.conversion);
      this.orderForm.get('paidAmount').setValue(outcome);
      this.orderForm.get('payRate').setValue(result.rate);
      this.totalUSD = result.amountUSD;
      // this.amountUSD.setValue(result.amountUSD);
    });
  }

  updateFromAmount() {
    const pm = this.orderForm.get('payMethod').value;
    const amount = this.orderForm.get('paidAmount').value || 0;

    if (amount === 0) {
      this.orderForm.get('appTokenQty').setValue(0);
    }

    this._currenciesService.convertToEXC(amount, pm, false, false)
    .subscribe((result) => {
      const outcome = this.returnFixedNumber(result.conversion);
      this.orderForm.get('appTokenQty').setValue(outcome);
      this.orderForm.get('payRate').setValue(result.rate);
      this.totalUSD = result.amountUSD;
      // this.amountUSD.setValue(result.amountUSD);
    });
  }

  returnFixedNumber(value: number): number {
   const outcome = value;
    return outcome;
  }

  ngOnDestroy() {
      // this._createOrderService.clearOrder();
  }
}
