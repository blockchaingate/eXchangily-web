import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IcotxService } from '../../../service/icotx/icotx.service';
import { Icotx, IcotxStatus, IcotxSorted } from '../../../models/icotx';
import { IcotxesAuthService } from '../../../service/icotxes-auth/icotxes-auth.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { mergeMap ,  map ,  filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  serverMessage: string;
  icotx: Icotx;
  loaded = false;
  admin = false;
  pend: Observable<any>;
  pendingLength = 0;

  private icotxes: IcotxSorted = {
    pending: [],
    completed: [],
    deleted: []
  };

  constructor(private _activatedRoute: ActivatedRoute, private _icotx: IcotxService,
              public localIcotxes: IcotxesAuthService) { }

  ngOnInit() {

    this.pend = this.localIcotxes.pending;
    this.pendingLength = this.localIcotxes.pending.value.length;

    this._activatedRoute.data
    .pipe(
      map( (data) => {
        this.admin = data.isAdmin;
        return data.user;
      }),
      filter((user) => {
        if (user.email) {
          return true;
        } else {
          return false;
        }
      }),
      mergeMap(user => this._icotx.findIcotxes(user._id)))
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

  ngOnDestroy() {
    this.localIcotxes.clear();
  }
}
