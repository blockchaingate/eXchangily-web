import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'pin-number-modal',
    standalone: true,
    imports: [ModalDirective, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslateModule, MatAutocompleteModule],
    templateUrl: './pin-number.modal.html',
    styleUrls: ['./pin-number.modal.css']
})
export class PinNumberModal {
    @ViewChild('pinModal', {static: true}) public pinModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedPin = new EventEmitter<string>();
    options: string[] = [];
    pinForm: any;

    constructor(private fb: FormBuilder) {
        this.pinForm = this.fb.group({
            pin: ['']
        });
    }
    myControl = new FormControl();

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
