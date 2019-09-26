import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Kyc } from '../../../models/kyc';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KycService } from '../../../service/kyc/kyc.service';
import { UserService } from '../../../service/user/user.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user';

@Component({
  selector: 'app-kyc-admin',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  kyc: Kyc;
  user: User;
  name = '';
  residence = '';
  accredited = false;
  msg: string;
  kycForm: FormControl;
  denyreason = '';

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router,
    private _kycServ: KycService, private _userServ: UserService) {}

  ngOnInit() {
    const uId = this._activatedRoute.snapshot.paramMap.get('id');
    if (uId) {
      this.loadUser(uId);
        this.loadKyc(uId);
    }
  }

  loadUser(id: string) {
    this._userServ.getUserById(id).subscribe (
      ret => {
        this.user = ret;
      },
      err => this.msg = err
    );

  }

  loadKyc(userId: string) {
    this._kycServ.findKYCs(userId).subscribe (
      ret => {
        this.kyc = ret[0];
        this.setData(this.kyc);
      },
      err => this.msg = err
    );
  }

  setData(kyc: Kyc) {
      this.name = kyc.name;
      this.residence = kyc.countryOfResidency;
      this.accredited = kyc.accreditedInvestor;

      if (kyc.photoUrls) {
          let imgId = 0;
          for (let i = 0; i < kyc.photoUrls.length; i++) {
            if (kyc.photoUrls[i]) {
                imgId ++;
                const img = <HTMLImageElement>document.getElementById('id' + imgId);
                img.src = kyc.photoUrls[i];
            }
          }
      }

      if (kyc.selfieUrls) {
        let selfieId = 0;
        for (let i = 0; i < kyc.selfieUrls.length; i++) {
          if (kyc.selfieUrls[i]) {
              selfieId ++;
              const selfie = <HTMLImageElement>document.getElementById('self' + selfieId);
              selfie.src = kyc.selfieUrls[i];
          }
        }
    }
  }

  setDeny() {
    if (!this.denyreason || this.denyreason.length < 2) {
      return;
    } else {
      this._userServ.updateUser({_id: this.kyc.memberId, kyc: 3, kycNote: this.denyreason}).subscribe(
        ret => {
          this._router.navigate(['/account/admin/kycs']);
        },
        err => this.msg = err
    );
  }
  }

  setPass() {
      this._userServ.updateUser({_id: this.kyc.memberId, kyc: 100}).subscribe(
          ret => {
            this._router.navigate(['/account/admin/kycs']);
          },
          err => this.msg = err
      );
  }
}
