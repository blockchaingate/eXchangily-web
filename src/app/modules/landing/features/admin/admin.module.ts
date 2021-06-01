import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentsModule } from '../../components/components.module';
import { OtcModule } from '../../../otc/otc.module';
import { NoAuthGuard } from '../../guards/no-auth/no-auth.guard';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { ReferralModule } from '../account/referrals/referrals.module';
import { AdminComponent } from './admin.component';
import { AddcoinComponent } from './coin/addcoin.component';
import { MerchantComponent } from './merchant/merchant.component';
import { MembersComponent } from './members/members.component';
import { PaymentMethodsComponent } from './paymentmethods/paymentmethods.component';
import { OrderEditComponent } from './order/order-edit.component';
import { OrdersComponent } from './otc/orders/orders.component';
import { CampaignOrdersComponent } from './campaign-orders/campaign-orders.component';
import { OrderManagementComponent } from './order/order-mngmt.component';
import { OtcListingComponent } from './otc/otc-listing/otc-listing.component';
import { KycComponent } from './kyc/kyc.component';
import { KycsComponent } from './kyc/kycs.component';
import { AdminRoutingModule } from './admin-routing.module';
import { CampaignOrderService } from '../../service/campaignorder/campaignorder.service';
import { MerchantService } from '../../service/../../../services/merchant.service';
import { OrderItemComponent } from './order/order-item.component';
import { TokenlockService } from '../../service/tokenlock/tokenlock.service';
import { StarService } from '../../service/star/star.service';
import { TokenlockComponent } from './tokenlock/tokenlock.component';
import { MatButtonModule } from '@angular/material/button';
import { OtcService } from '../../../../services/otc.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PaymentMethodService } from '../../../../services/paymentmethod.service';
import { OtcListingOrdersModal } from './modals/otc-listing-orders/otc-listing-orders.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementListComponent } from './announcements/announcement-list/announcement-list.component';
import { AnnouncementAddComponent } from './announcement-add/announcement-add.component';
import { StarOrdersComponent } from './star-orders/star-orders.component';
import { StarSettingsComponent } from './star-settings/star-settings.component';
import { StarSettingAddComponent } from './star-setting-add/star-setting-add.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  imports: [
    
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    SharedModule,
    ReactiveFormsModule,
    MatInputModule,
    ComponentsModule,
    TranslateModule,
    AdminRoutingModule,
    ReferralModule,
    MatButtonModule,
    OtcModule,
    MatDialogModule,
    ModalModule.forRoot()
  ],
  providers: [AuthGuard, NoAuthGuard, TokenlockService, StarService,
    PaymentMethodService, CampaignOrderService, MerchantService, OtcService],
  declarations: [
    AdminComponent,
    AddcoinComponent,
    OtcListingComponent,
    OrderEditComponent,
    MembersComponent,
    PaymentMethodsComponent,
    CampaignOrdersComponent,
    OrdersComponent,
    OrderManagementComponent,
    KycComponent,
    MerchantComponent,
    KycsComponent,
    OrderItemComponent,
    TokenlockComponent,
    OtcListingOrdersModal,
    AnnouncementsComponent,
    AnnouncementListComponent,
    AnnouncementAddComponent,
    StarOrdersComponent,
    StarSettingsComponent,
    StarSettingAddComponent
  ]
})
export class AdminModule { }
