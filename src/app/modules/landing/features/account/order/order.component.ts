import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Icotx, IcotxStatus, IcotxStatuses, IcotxColours } from '../../../models/icotx';
import { IcotxService } from '../../../service/icotx/icotx.service';
import { IcotxesAuthService } from '../../../service/icotxes-auth/icotxes-auth.service';
import { AccountPaths } from '../../../paths/account-paths';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  icotx: Icotx;
  colours = IcotxColours;
  backRoute = AccountPaths[2].absolute;
  admin = false;
  statuses = IcotxStatuses;
  loaded = false;

  updateOrderForm: FormGroup;
  serverMessage: string;
  formEdit = false;

  private initStatus: IcotxStatus;
  constructor(private _icotxService: IcotxService, private _route: ActivatedRoute,
              private _localIcotx: IcotxesAuthService, private _router: Router) { }

  ngOnInit() {
    this.backRoute = AccountPaths[2].absolute;
    this._route.data.pipe(map(data => {
      this.admin = data.isAdmin;
      return data.icotx;
    }))
    .subscribe(ret => {
      if (!ret.status) {
        ret.status = 'pending';
      }
      this.initStatus = <IcotxStatus>ret.status;
      this.icotx = ret;
      this.updateOrderForm = new FormGroup({
        'status': new FormControl(this.icotx.status.toLocaleLowerCase(), [
          Validators.required
        ]),
        'notes': new FormControl(this.icotx.notes, [
          Validators.maxLength(1500)
        ])
      });

      this.loaded = true;
    });
  }

  exit() {
    this._router.navigate([this.backRoute]);
  }

  formEditToggle() {
    this.formEdit = !this.formEdit;

    if (!this.formEdit) {
      this.updateOrderForm.reset();
    }
  }

  submit() {
    const icotx: Icotx = Object.assign(this.icotx, this.updateOrderForm.value);
    this._icotxService.updateIcotx(icotx)
    .subscribe(
      res => {
        this._localIcotx.findAndUpdate(<IcotxStatus>this.initStatus.toLowerCase(), icotx._id, icotx);
        this.icotx = icotx;
        this.serverMessage = '';
        this.formEdit = false;
      },
      err => {
        this.serverMessage = err;
      });
  }

  isCrypto(index: number): boolean {
    const pay = this.icotx.payment[index].payMethod;
    let crypto = false;

    if (pay === 'eth' ||
        pay === 'fab' ||
          pay === 'btx') {
      crypto = true;
    }

    return crypto;
  }

  getStatus() {
    return this.icotx.status.toLowerCase();
  }
}
