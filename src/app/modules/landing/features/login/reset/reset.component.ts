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
  resetForm: FormGroup = new FormGroup({});
  emailData = '';
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
    if (this.email) {
      this._userService.requestPwdReset(this.email.value).then(
      error => { this.errorMessage = error ? String(error) : 'An unknown error occurred'; }
      );
    }
  }

  processSuccess(retLogin: any) {
    this.errorMessage = '';
    this.sent = true;
  }
}
