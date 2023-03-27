import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'private-key-modal',
    templateUrl: './private-key.modal.html',
    styleUrls: ['./private-key.modal.css']
})
export class PrivateKeyModal {
    @ViewChild('privateKeyModal', {static: true}) public privateKeyModal: ModalDirective;
    @Output() confirmedPrivateKey = new EventEmitter<string>();
    options: string[] = [];
    privateKeyForm = this.fb.group({
        privateKey: ['']
    });    
    
    constructor(private fb: FormBuilder) {

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
