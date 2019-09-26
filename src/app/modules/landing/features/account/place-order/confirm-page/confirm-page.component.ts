import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../models/user';
import { Application } from '../../../../models/application';

import { AccountPaths } from '../../../../paths/account-paths';
import { CreateOrderService } from '../../../../service/create-order/create-order.service';
import { IcotxService } from '../../../../service/icotx/icotx.service';
import { AppService } from '../../../../service/app-service/app.service';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.scss']
})
export class ConfirmPageComponent implements OnInit, OnDestroy {
  coins = 'btc,eth,fab,BTC,ETH,FAB';
  confirmForm: FormGroup;
  serverError = '';
  success = false;
  loaded = false;

// app: Application;
  user: User;
// fabAdd = '';
//  ethAdd = '';
//  btcAdd = '';
//  ethCoin: {symbol: string, add: string};
//  btcCoin: {symbol: string, add: string};
//  fabCoin: {symbol: string, add: string};

  private goingBack = false;

  get transitIds() {
    return this.confirmForm.get('transitIds') as FormArray;
  }

  constructor(
        private _icotx: IcotxService, private _crOS: CreateOrderService,
        private _router: Router, private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder, private _appServ: AppService) {
    if (!this._crOS.icotx || this._crOS.icotx.payment[0].appTokenQty < 100) {
      this._router.navigate([AccountPaths[2].absolute]);
    }

    this._activatedRoute.data.subscribe(ret => {
      this.user = ret.user;
    });
  }

  ngOnInit() {
    this.confirmForm = new FormGroup({
      'transitIds': this._fb.array(this.buildForm())
    });

    this.loaded = true;

    // 30min timer
    window.setTimeout(() => {
      this._crOS.clearOrder();
      // TODO alert
      this._router.navigate([AccountPaths[2].absolute]);
    }, 1800000);
  }

  submit() {
    if (!this.confirmForm.valid) {
      return;
    }

    const addrs = { btcAddress: this.user.btcAdd, ethAddress: this.user.ethAdd, fabAddress: this.user.fabAdd };
    // const addrs = { btcAddress: this.btcAdd, ethAddress: this.ethAdd, fabAddress: this.fabAdd };
    this._icotx.createIcotx(this._crOS.objectWithTransitIDs(this.transitIds.value, addrs))
    .subscribe(
      ret => {
        this.serverError = '';

        this._crOS.clearOrder();
        this.success = true;
      },
      err => {
        this.serverError = err;
      });
  }

  back() {
    this.goingBack = true;
    this._router.navigate([AccountPaths[3].absolute]);
  }

  goToNewOrder() {
    this._router.navigate([AccountPaths[3].absolute]);
  }

  goToViewOrders() {
    this._router.navigate([AccountPaths[3].absolute]);
  }

  private buildForm() {
    const payments = this._crOS.icotx.payment;

    const form_array = [];

    for (let i = 0; i < payments.length; i++) {
      form_array.push(
        this._fb.group({
          'transitId': new FormControl('', [Validators.required])
        })
      );
    }
    return form_array;
  }

  ngOnDestroy() {
    if (!this.goingBack) {
      this._crOS.clearOrder();
    }
  }
}
