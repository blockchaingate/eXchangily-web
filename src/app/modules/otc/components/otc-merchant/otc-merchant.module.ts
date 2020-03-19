import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { OtcMerchantComponent } from './otc-merchant.component';
import { ListComponent } from './list/list.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        OtcMerchantComponent,
        ListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatSelectModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        TranslateModule,
        MatInputModule,
        ModalModule
    ]
})
export class OtcMerchantModule { }
