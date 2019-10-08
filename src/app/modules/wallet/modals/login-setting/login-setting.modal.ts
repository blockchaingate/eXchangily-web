import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'login-setting-modal',
    templateUrl: './login-setting.modal.html',
    styleUrls: ['./login-setting.modal.css']
})
export class LoginSettingModal implements OnInit{
    @ViewChild('loginSettingModal', {static: true}) public loginSettingModal: ModalDirective;
    @Output() confirmedLoginSetting = new EventEmitter<string>();
    loginSettingForm: FormGroup;
   

    constructor(private fb: FormBuilder) {

    }

    ngOnInit() {
        this.loginSettingForm = this.fb.group({
            password: [null, [
                Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]
            ],
            pwdconfirm: ['']
        }, { validator: this.checkPasswords });        
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.pwdconfirm.value;
        if (pass !== confirmPass) {
          return { notSame: true };
        }

        return null;
    } 

    onSubmit() {
        const password = this.loginSettingForm.controls.password.value;
        this.confirmedLoginSetting.emit(password);
        this.hide();
    }

    show() {
        this.loginSettingModal.show();
    }
    hide() {
        this.loginSettingModal.hide();
    }
}
