import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'display-setting-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, ReactiveFormsModule, TranslateModule],
    templateUrl: './display-setting.modal.html',
    styleUrls: ['./display-setting.modal.css']
})
export class DisplaySettingModal implements OnInit{
    @ViewChild('displaySettingModal', {static: true}) public displaySettingModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedDisplaySetting = new EventEmitter<string>();
    displaySettingForm: FormGroup = {} as FormGroup;
   
    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.displaySettingForm = this.fb.group({
            password: [''],
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
        const password = this.displaySettingForm.value.password;
        this.confirmedDisplaySetting.emit(password);
        this.hide();
    }

    show() {
        this.displaySettingModal.show();
    }

    hide() {
        this.displaySettingModal.hide();
    }
}
