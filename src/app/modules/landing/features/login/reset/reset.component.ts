import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user/user.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../style.scss']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  emailData: string;
  sent = false;
  errorMessage = '';

  get email()  { return this.resetForm.get('email'); }

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      'email': new FormControl(this.emailData, [
        Validators.required,
        Validators.email
      ])
    });
  }

  onSubmit() {
    this._userService.requestPwdReset(this.email.value).then(
      ret => this.processSuccess(ret),
      error => { this.errorMessage = error; }
    );
  }

  processSuccess(retLogin) {
    this.errorMessage = '';
    this.sent = true;
  }
}
