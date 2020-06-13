import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { OtcMerchantRoutingModule } from './otc-merchant-routing.module';

import { MerchantService } from '../../../../services/merchant.service';
import { OtcService } from '../../../../services/otc.service';
import { OtcMerchantComponent } from './otc-merchant.component';
import { MerchantApplicationComponent } from './merchant-application/merchant-application.component';
import { ListingComponent } from './listing/listing.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [
        OtcMerchantComponent,
        ListingComponent,
        MerchantApplicationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        MatSelectModule, 
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        TranslateModule,
        MatInputModule,
        OtcMerchantRoutingModule,
        ModalModule
    ],
    providers: [MerchantService, OtcService]
})
export class OtcMerchantModule { }
