import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IcotxService } from '../../../../service/icotx/icotx.service';
import { Icotx, IcotxSorted } from '../../../../models/icotx';
import { UserAuth } from '../../../../service/user-auth/user-auth.service';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { mergeMap ,  map ,  filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-referrals',
  templateUrl: './view-referrals.component.html',
  styleUrls: ['./view-referrals.component.scss']
})
export class ViewReferralsComponent implements OnInit {
  serverMessage: string;
  icotx: Icotx;
  loaded = false;
  admin = false;
  pend: Observable<any>;
  pendingLength = 0;

  localIcotxes: {
    pending: BehaviorSubject<Array<Icotx>>,
    completed: BehaviorSubject<Array<Icotx>>
  } = {
      pending: new BehaviorSubject([]),
      completed: new BehaviorSubject([])
  };

  constructor(private _icotx: IcotxService, private _userAuth: UserAuth,
              private _activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this._activatedRoute.data
    .pipe(
      map((data) => {
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
      mergeMap(user => this._icotx.getChildIcotx(user._id)))
      .subscribe(res => {
        const tmp = {
          pending: [],
          completed: []
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

        this.loaded = true;
      },
      err => {
        this.serverMessage = err;
        this.loaded = true;
      });

  }

}
