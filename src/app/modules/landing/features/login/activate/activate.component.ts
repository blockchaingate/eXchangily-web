import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['../style.scss']
})
export class ActivateComponent implements OnInit {
  activateForm: FormGroup;
  formDetails = {email: '', code: ''};
  errorMessage: string;

  constructor(private _userService: UserService, private _router: Router, private _route: ActivatedRoute) { }

  get email() { return this.activateForm.get('email'); }

  get code() { return this.activateForm.get('code'); }

  ngOnInit() {
    this.formDetails.email = this._route.snapshot.paramMap.get('email');
    this.formDetails.code = this._route.snapshot.paramMap.get('activeCode');

    this.activateForm = new FormGroup({
      'email': new FormControl(this.formDetails.email, [
        Validators.required,
        Validators.email
      ]),
      'code': new FormControl(this.formDetails.code, [
        Validators.required
      ])
    });
  }

  onSubmit() {
    this._userService.activation(this.email.value, this.code.value).then(
      ret => this.proccessSuccess(ret),
      err => { this.errorMessage = err || 'Activation failure. '; }
    );
  }

  proccessSuccess(retMember) {
    this.errorMessage = null;
    if (retMember) {
      this._router.navigate(['login/signin']);
    } else {
      this.errorMessage = 'Activation failure. ';
    }
  }
}
