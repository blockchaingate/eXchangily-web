import { Component, OnInit, Input } from '@angular/core';
import { UserAuth } from '../../../../service/user-auth/user-auth.service';
import { Icotx, IcotxColours } from '../../../../models/icotx';

@Component({
  selector: 'icotx-item',
  templateUrl: './icotx.component.html',
  styleUrls: ['./icotx.component.scss']
})
export class IcotxComponent implements OnInit {
  @Input() order: Icotx = {} as Icotx;
  @Input() userId = '';
  @Input() admin = false;
  @Input() clickable = true;

  color = '';
  private colours = IcotxColours;

  constructor(private _userAuth: UserAuth) { }

  ngOnInit() {
    this.userId = this._userAuth.id;
    if (this.order.status === undefined || this.order.status === 'pending') {
      this.color = this.colours.pending;
    } else if (this.order.status === 'completed') {
      this.color = this.colours.completed;
    } else if (this.order.status === 'deleted') {
      this.color = this.colours.deleted;
    }
  }
}
