import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user/user.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../style.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  passwordMin = 5;
  sent = false;
  errorMessage = '';

  private id = '';
  private code = '';

  get password() { return this.passwordForm.get('password'); }

  get passwordConfirm() { return this.passwordForm.get('passwordConfirm'); }

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.passwordForm = new FormGroup({
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordMin)
      ]),
      'passwordConfirm': new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordMin)
      ])
    });

    this.id = this._route.snapshot.paramMap.get('id');
    this.code = this._route.snapshot.paramMap.get('code');
  }

  onSubmit() {
    if (this.password.value !== this.passwordConfirm.value) {
      return;
    }
    this.errorMessage = '';
    this._userService.executePwdReset(this.id, this.code, this.password.value).then(
      ret => this.processSuccess(ret),
      error => this.errorMessage = error
    );
  }

  processSuccess(ret: any) {
    alert('Password successfully changed!');
    this._router.navigate(['/login/signin']);
  }
}
