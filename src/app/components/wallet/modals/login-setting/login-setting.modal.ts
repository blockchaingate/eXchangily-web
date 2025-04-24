import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'login-setting-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, ReactiveFormsModule, TranslateModule],
    templateUrl: './login-setting.modal.html',
    styleUrls: ['./login-setting.modal.css']
})
export class LoginSettingModal implements OnInit{
    @ViewChild('loginSettingModal', {static: true}) public loginSettingModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedLoginSetting = new EventEmitter<string>();
    loginSettingForm: FormGroup = {} as FormGroup;
   
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.loginSettingForm = this.fb.group({
            password: [null, [
                Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]
            ],
            pwdconfirm: ['']
        }, { validator: this.checkPasswords });        
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.value.password;
        const confirmPass = group.value.pwdconfirm;
        if (pass !== confirmPass) {
          return { notSame: true };
        }

        return null;
    } 

    onSubmit() {
        const password = this.loginSettingForm.value.password;
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
