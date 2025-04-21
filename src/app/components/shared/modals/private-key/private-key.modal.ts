import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'private-key-modal',
    standalone: true,
    imports: [ModalDirective, CommonModule, ReactiveFormsModule, MatFormFieldModule, TranslateModule],
    templateUrl: './private-key.modal.html',
    styleUrls: ['./private-key.modal.css']
})
export class PrivateKeyModal {
    @ViewChild('privateKeyModal', {static: true}) public privateKeyModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedPrivateKey = new EventEmitter<string>();
    options: string[] = [];
    privateKeyForm: any;

    constructor(private fb: FormBuilder) {
        this.privateKeyForm = this.fb.group({
            privateKey: ['']
        });
    }
    
    onSubmit() {
        const privateKey: any = this.privateKeyForm.get('privateKey')?.value;

        this.privateKeyForm.patchValue({
            privateKey: ''
        });        
        this.confirmedPrivateKey.emit(privateKey);
        this.hide();
    }

    show() {
        this.privateKeyModal.show();
    }
    hide() {
        this.privateKeyModal.hide();
    }
}
