import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'pin-number-modal',
    templateUrl: './pin-number.modal.html',
    styleUrls: ['./pin-number.modal.css']
})
export class PinNumberModal {
    @ViewChild('pinModal', {static: true}) public pinModal: ModalDirective;
    @Output() confirmedPin = new EventEmitter<string>();
    options: string[] = [];
    pinForm = this.fb.group({
        pin: ['']
    });    
    myControl = new FormControl();
    constructor(private fb: FormBuilder) {

    }

    onSubmit() {
        const pin: any = this.pinForm.get('pin')?.value;

        this.pinForm.patchValue({
            pin: ''
        });        
        this.confirmedPin.emit(pin);
        this.hide();
    }

    show() {
        this.pinModal.show();
    }
    hide() {
        this.pinModal.hide();
    }
}
