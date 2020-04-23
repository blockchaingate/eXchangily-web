import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { Icotx, IcotxColours } from '../../../models/icotx';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html'
})
export class OrderItemComponent implements OnInit {
  @Input() order: Icotx;
  @Input() userId: string;
  @Input() admin: boolean;
  @Input() clickable = true;

  color: string;
  private colours = IcotxColours;

  constructor(private _userAuth: UserAuth, private _route: ActivatedRouteSnapshot) { }

  ngOnInit() {
    const orderdata = this._route.paramMap.get('orderdata');
    //  alert('aaa: ' + JSON.stringify(orderdata));
    this.userId = this._userAuth.id;
    this.color = this.colours[this.order.status];
  }
}
