import { Component, OnInit, Input } from '@angular/core';
import { UserAuth } from '../../../../service/user-auth/user-auth.service';
import { Icotx, IcotxColours } from '../../../../models/icotx';

@Component({
  selector: 'icotx-item',
  templateUrl: './icotx.component.html',
  styleUrls: ['./icotx.component.scss']
})
export class IcotxComponent implements OnInit {
  @Input() order: Icotx;
  @Input() userId: string;
  @Input() admin: boolean;
  @Input() clickable = true;

  color: string;
  private colours = IcotxColours;

  constructor(private _userAuth: UserAuth) { }

  ngOnInit() {
    this.userId = this._userAuth.id;
    this.color = this.colours[this.order.status];
  }
}
