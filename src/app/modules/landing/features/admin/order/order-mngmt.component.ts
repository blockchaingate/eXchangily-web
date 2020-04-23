import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IcotxService } from '../../../service/icotx/icotx.service';
import { Icotx, IcotxStatus, IcotxSorted } from '../../../models/icotx';
import { IcotxesAuthService } from '../../../service/icotxes-auth/icotxes-auth.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { mergeMap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-mngmt.component.html',
  styleUrls: ['./order-mngmt.component.scss']
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  serverMessage: string;
  icotx: Icotx;
  status = 'pending';
  loaded = false;
  admin = true;
  pend: Observable<any>;
  pendingLength = 0;
  selected = 0;

  private icotxes: IcotxSorted = {
    pending: [],
    completed: [],
    deleted: []
  };

  constructor(private _activatedRoute: ActivatedRoute, private _icotx: IcotxService,
              public localIcotxes: IcotxesAuthService, private _router: Router) {}

  ngOnInit() {
    this.pend = this.localIcotxes.pending;
    this.pendingLength = this.localIcotxes.pending.value.length;

    this._activatedRoute.data
    .pipe(mergeMap(user => this._icotx.findIcotxes('', '', '', '', '')))
      .subscribe(res => {
        const tmp = {
          pending: [],
          completed: [],
          deleted: []
        };

        for (let i = 0; i < res.length; i++) {
          if (!res[i].status) {
            res[i].status = 'pending';
          }
          res[i].status = res[i].status.toLowerCase();
          tmp[res[i].status].push(res[i]);
        }
        this.localIcotxes.pending.next(tmp.pending);
        this.localIcotxes.completed.next(tmp.completed);
        this.localIcotxes.deleted.next(tmp.deleted);

        this.loaded = true;
      },
      err => {
        this.serverMessage = err;
        this.loaded = true;
      });
  }

  selectStatus(num: number) {
    if (num === 0) { // pending
      this.status = 'pending';
    } else if (num === 1) { // completed
      this.status = 'completed';
    } else if (num === 2) { // deleted
      this.status = 'deleted';
    }
  }

  editorder(order: Icotx) {
    this._router.navigate(['account/admin/order-edit', order._id]);
  }

  ngOnDestroy() {
    this.localIcotxes.clear();
  }
}
