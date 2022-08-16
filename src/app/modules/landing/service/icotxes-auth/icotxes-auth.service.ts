import { Injectable } from '@angular/core';
import { IcotxSorted, IcotxStatus, Icotx } from '../../models/icotx';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IcotxesAuthService {
  private icotxes: any;

  constructor() { this.initIcotxes(); }

  get pending() {
    return this.icotxes.pending;
  }

  get completed() {
    return this.icotxes.completed;
  }

  get deleted() {
    return this.icotxes.deleted;
  }

  // find a icotx in array and update local contents
  // push into respective status array
  findAndUpdate(oldStatus: IcotxStatus, id: string, newProps: Icotx) {
    const group: Array<Icotx> = this.icotxes[oldStatus].getValue();
    const index = group.findIndex((order) => {
      return order._id === id;
    });

    if (index !== -1) {
      const icotxItem: Icotx = (group.slice(index, index + 1))[0];
      group.splice(index, 1);
      Object.assign(icotxItem, newProps);

      this.icotxes[oldStatus].next(group);

      if (newProps.status && newProps.status !== oldStatus) {
        const old: Array<Icotx> = this.icotxes[newProps.status].getValue();
        old.push(icotxItem);
        this.icotxes[newProps.status].next(old);
      }
    }
  }

  clear() {
    this.initIcotxes();
  }

  private initIcotxes() {
    this.icotxes = {
      pending: new BehaviorSubject([]),
      completed: new BehaviorSubject([]),
      deleted: new BehaviorSubject([])
    };
  }
}
