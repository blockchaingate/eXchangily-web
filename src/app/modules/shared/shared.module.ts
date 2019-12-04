
import { NgModule } from '@angular/core';
import { PinNumberModal } from './modals/pin-number/pin-number.modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
    declarations: [
        PinNumberModal
    ],
    imports: [
        ModalModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        PinNumberModal
    ],
    providers: [
    ]
})
export class SharedModule { }