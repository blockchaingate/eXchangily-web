import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { ReferralModule } from './referrals/referrals.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountComponent } from './account/account.component';
import { InfoComponent } from './info/info.component';
import { OtcModule } from '../../../otc/otc.module';
import { AccountRoutingModule } from './account-routing.module';
import { DetailsComponent } from './details/details.component';
import { SecurityComponent } from './security/security.component';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { OrderListComponent } from './order-list/order-list.component';
import { PlaceOrderComponent } from './place-order/order-page/place-order.component';
import { ConfirmPageComponent } from './place-order/confirm-page/confirm-page.component';
import { KycComponent } from './kyc/kyc.component';
import { MerchantComponent } from './merchant/merchant.component';
import { OtcListingComponent } from './otc-listing/otc-listing.component';
import { OtcOrderComponent } from './otc-order/otc-order.component';
import { MyOtcOrderComponent } from './my-otc-order/my-otc-order.component';

import { AppService } from '../../service/app-service/app.service';
import { UserService } from '../../service/user/user.service';
import { CurrenciesService } from '../../service/currencies/currencies.service';
import { UserResolver, UserAdminResolver } from '../../resolvers/user/user.resolve';
import { AppUsersResolver, ChildReferralsResolver } from '../../resolvers/app-users/app-users.resolve';
import { IcotxResolver, IcotxParentResolver } from '../../resolvers/icotx/icotx.resolve';
import { IcotxService } from '../../service/icotx/icotx.service';
import { AppUsersService } from '../../service/app-users/app-users.service';
import { IcotxesAuthService } from '../../service/icotxes-auth/icotxes-auth.service';
// import { IcotxComponent } from './components/icotx/icotx.component';
// import { OrderComponent } from './order/order.component';
import { CreateOrderService } from '../../service/create-order/create-order.service';
import { KycService } from '../../service/kyc/kyc.service';
import { PlaceOrderFormComponent } from './place-order/place-order-form/place-order-form.component';
import { CreateOrderSubmissionComponent } from './components/create-order-submission/create-order-submission.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../../shared/shared.module';
import { CoinService } from '../../../../services/coin.service';
import { AlertService } from '../../../../services/alert.service';
import { UtilService } from '../../../../services/util.service';
import { WalletService } from '../../../../services/wallet.service';
import { StorageService } from '../../../../services/storage.service';
import { OtcService } from '../../../../services/otc.service';
import { TimerService } from '../../../../services/timer.service';

import {MatSelectModule} from '@angular/material/select';
@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    OtcModule,
    ReactiveFormsModule,
    ComponentsModule,
    ReferralModule,
    MatSelectModule
  ],
  providers: [
    AuthGuard,
    UserResolver,
    UserAdminResolver,
    IcotxResolver,
    IcotxService,
    IcotxesAuthService,
    CurrenciesService,
    CreateOrderService,
    UserService,
    AppUsersResolver,
    IcotxParentResolver,
    KycService,
    CoinService,
    AlertService,
    UtilService,
    WalletService,
    StorageService,
    OtcService,
    TimerService,
    ChildReferralsResolver
  ],
  declarations: [
    AccountComponent,
    InfoComponent,
    DetailsComponent,
    OrderListComponent,
    PlaceOrderComponent,
    SecurityComponent,
    MerchantComponent,
    OtcListingComponent,
    ConfirmPageComponent,
    OtcOrderComponent,
    MyOtcOrderComponent,
    // OrderComponent,
    PlaceOrderFormComponent,
    KycComponent,
    CreateOrderSubmissionComponent,
    // ViewReferralsComponent
  ],
  exports: [
     MerchantComponent,
  ]
})
export class AccountModule { }
