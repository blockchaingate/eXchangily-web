import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'display-pin-number-modal',
    standalone: true,
    imports: [ModalDirective, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, TranslateModule],
    templateUrl: './display-pin-number.modal.html',
    styleUrls: ['./display-pin-number.modal.css']
})
export class DisplayPinNumberModal {
    @ViewChild('displayPinModal', {static: true}) public displayPinModal: ModalDirective = {} as ModalDirective;
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
        this.displayPinModal.show();
    }
    hide() {
        this.displayPinModal.hide();
    }
}
