import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { TranslateModule } from '@ngx-translate/core';
import { OtcMerchantRoutingModule } from './otc-merchant-routing.module';
import { WalletService } from '../../../../services/wallet.service';
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
    providers: [MerchantService, OtcService, WalletService]
})
export class OtcMerchantModule { }
