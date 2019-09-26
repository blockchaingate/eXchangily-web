import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tokenlock } from '../../../models/tokenlock';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenlockService } from '../../../service/tokenlock/tokenlock.service';
import { UserService } from '../../../service/user/user.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user';

@Component({
  selector: 'app-toknlock-admin',
  templateUrl: './tokenlock.component.html',
  styleUrls: ['./tokenlock.component.css']
})
export class TokenlockComponent implements OnInit {
  tokenlock: Tokenlock;
  symbol = 'EXG';
  ownerAdd: string;
  msg: string;
  editmode: boolean;
  kycForm: FormControl;

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router,
    private _tokenlockServ: TokenlockService) {}

  ngOnInit() {
    const tlId = this._activatedRoute.snapshot.paramMap.get('id');
    if (tlId) {
        this.loadTokenlock(tlId);
    } else {
        this.tokenlock = {
            name: 'eXchangily Security Token',
            symbol: 'EXG',
            decimals: 18,
            active: true
        };
    }
  }

  loadTokenlock(id: string) {
    this._tokenlockServ.getTokenlock(id).subscribe (
      ret => {
        this.tokenlock = ret;
      },
      err => this.msg = err
    );
  }

  loadTokenlockByOwnerAddress(symbol: string, ownerAdd: string) {
    this._tokenlockServ.getTokenlockByOwnerAddress(symbol, ownerAdd).subscribe (
      ret => {
        this.tokenlock = ret[0];
      },
      err => this.msg = err
    );
  }

  setEdit() {
      this.editmode = !this.editmode;
  }

  submit() {
      this.editmode = false;
      if (this.tokenlock._id) {
        this._tokenlockServ.updateTokenlock(this.tokenlock).subscribe(
            ret => { this.tokenlock = ret; },
            err => { this.msg = err; }
        );
      } else {
          this._tokenlockServ.createTokenlock(this.tokenlock).subscribe(
              ret => { this.tokenlock = ret; },
              err => { this.msg = err; }
        );
      }
  }

  onSearch() {
      this.editmode = false;

      this._tokenlockServ.getTokenlockByOwnerAddress(this.symbol, this.ownerAdd).subscribe(
          ret => { this.tokenlock = ret[0]; },
          err => { this.msg = JSON.stringify(err); }
      );
  }
}
