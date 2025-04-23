import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'display-pin-number-modal',
    templateUrl: './display-pin-number.modal.html',
    styleUrls: ['./display-pin-number.modal.css']
})
export class DisplayPinNumberModal {
    @ViewChild('displayPinModal', {static: true}) public displayPinModal: ModalDirective;
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
        this.displayPinModal.show();
    }
    hide() {
        this.displayPinModal.hide();
    }
}
