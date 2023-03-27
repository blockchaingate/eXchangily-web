
import { NgModule } from '@angular/core';
import { PinNumberModal } from './modals/pin-number/pin-number.modal';
import { PrivateKeyModal } from './modals/private-key/private-key.modal';
import { DisplayPinNumberModal } from './modals/display-pin-number/display-pin-number.modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SortByFieldPipe } from './pipes/sort.pipe';
import { FilterByChainPipe } from './pipes/filter-by-chain.pipe';
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
    declarations: [
        PinNumberModal,
        PrivateKeyModal,
        DisplayPinNumberModal,
        SortByFieldPipe,
        FilterByChainPipe
    ],
    imports: [
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        TranslateModule
        /*
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }), 
        */
    ],
    exports: [
        PinNumberModal,
        PrivateKeyModal,
        DisplayPinNumberModal,
        SortByFieldPipe,
        FilterByChainPipe,
        TranslateModule
    ],
    providers: [
    ]
})
export class SharedModule { }