import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IcotxService } from '../../../service/icotx/icotx.service';
import { Icotx, IcotxStatus, IcotxSorted } from '../../../models/icotx';
import { IcotxesAuthService } from '../../../service/icotxes-auth/icotxes-auth.service';

import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { mergeMap ,  map ,  filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  serverMessage = '';
  icotx: Icotx = {} as Icotx;
  loaded = false;
  admin = false;
  pend: Observable<any> = new Observable();
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
      map( (data: any) => {
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
      .subscribe((res: any) => {
        const tmp: { pending: Icotx[]; completed: Icotx[]; deleted: Icotx[] } = {
          pending: [],
          completed: [],
          deleted: []
        };

        for (let i = 0; i < res.length; i++) {
          if (!res[i].status) {
            res[i].status = 'pending';
          }
          const stat = res[i].status.toLowerCase() as keyof typeof tmp;
          tmp[stat].push(res[i]);
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
