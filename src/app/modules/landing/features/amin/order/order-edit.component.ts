import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params, ParamMap } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Icotx, IcotxStatus, IcotxStatuses, IcotxColours } from '../../../models/icotx';
import { IcotxService } from '../../../service/icotx/icotx.service';
import { IcotxesAuthService } from '../../../service/icotxes-auth/icotxes-auth.service';
import { AccountPaths } from '../../../paths/account-paths';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
  order: Icotx;
  colours = IcotxColours;
  statuses = IcotxStatuses;

  updateOrderForm: FormGroup;
  serverMessage: string;
  formEdit = false;

  totalAppTokenFm: FormControl;
  totalToPayFm: FormControl;

  private initStatus: IcotxStatus;
  constructor(private _icotxService: IcotxService, private _route: ActivatedRoute,
    private _localIcotx: IcotxesAuthService, private _router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._icotxService.getIcotx(id).subscribe(
        (res: Icotx) => {
          this.order = res;
          this.setPageData();
        },
        err => this.serverMessage = err
      );
    }
  }

  setPageData() {
    this.totalAppTokenFm = new FormControl(this.order.totalAppTokens, {
      validators: [
        Validators.required,
        Validators.min(100)
      ],
      updateOn: 'blur'
    });
    this.totalToPayFm = new FormControl(this.order.totalPaid, {
      validators: [
        Validators.required,
        Validators.min(100)
      ],
      updateOn: 'blur'
    });
  }

  exit() {
  }

  formEditToggle() {
    this.formEdit = !this.formEdit;

    if (!this.formEdit) {
      this.updateOrderForm.reset();
    }
  }

  save() {
    this.order.totalAppTokens = this.totalAppTokenFm.value;
    this.order.totalPaid = this.totalToPayFm.value;
    this.saveToServer();
  }

  setPaid() {
    if (confirm('Are you sure to mark it as COMPLETED ?')) {
      this.order.status = this.statuses[1];
      this.saveToServer();
    } else {
      // Do nothing!
    }
  }

  saveToServer() {
    this._icotxService.updateIcotx(this.order)
      .subscribe(
        (res: Icotx) => { this.order = res; },
        err => this.serverMessage = err
      );
    this.serverMessage = '';
    this.formEdit = false;
  }

  setPending() {
    if (confirm('Are you sure to mark it as PENDING ?')) {
      this.order.status = this.statuses[0];
      this._icotxService.updateIcotx(this.order)
        .subscribe(
          (res: Icotx) => { this.order = res; },
          err => this.serverMessage = err
        );
      this.serverMessage = '';
      this.formEdit = false;
    } else {
      // Do nothing!
    }
  }

  setDeleted() {
    if (confirm('Are you sure to DELETE it ?')) {
      this.order.status = this.statuses[2];
      this._icotxService.updateIcotx(this.order)
        .subscribe(
          (res: Icotx) => { this.order = res; },
          err => this.serverMessage = err
        );
      this.serverMessage = '';
      this.formEdit = false;
    } else {
      // Do nothing!
    }

  }

  submit() {
    const icotx: Icotx = Object.assign(this.order, this.updateOrderForm.value);
    this._icotxService.updateIcotx(icotx)
      .subscribe(
        res => {
          this._localIcotx.findAndUpdate(<IcotxStatus>this.initStatus.toLowerCase(), icotx._id, icotx);
          this.order = icotx;
          this.serverMessage = '';
          this.formEdit = false;
        },
        err => {
          this.serverMessage = err;
        });
  }

  isCrypto(index: number): boolean {
    const pay = this.order.payment[index].payMethod;
    let crypto = false;

    if (pay === 'eth' || pay === 'fab' || pay === 'btx') {
      crypto = true;
    }

    return crypto;
  }

  getStatus() {
    return this.order.status.toLowerCase();
  }
}
