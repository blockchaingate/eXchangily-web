import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../landing/guards/auth/auth.guard';
import { TradeComponent } from './components/trade/trade.component';
import { OtcRoutingModule } from './otc-routing.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { OtcPlaceOrderModal } from './modals/otc-place-order/otc-place-order';
import { MemberDetailModal } from './modals/member-detail/member-detail.component';
import { OtcPlaceOrderErrorModal } from './modals/otc-place-order-error/otc-place-order-error.component';
import { ApplyForMerchantModal } from './modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from './modals/confirm-payment/confirm-payment';
import { OtcCoinAddressModal } from './modals/otc-coin-address/otc-coin-address.component';
import { MerchantPipe } from './pipes/merchant.pipe';
import { OrderPipe } from './pipes/order.pipe';
import { MerchantOrdersComponent } from './components/merchant-orders/merchant-orders';
import { MemberOrdersComponent } from './components/member-orders/member-orders';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { UserPaymentMethodsComponent } from './components/userpaymentmethods/userpaymentmethods.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { OrderComponent } from './components/order/order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
// duplicate component in otc-merchant module
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { SharedModule } from '../shared/shared.module';
import { OtcMerchantModule } from '../otc/components/otc-merchant/otc-merchant.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentMethodService } from '../../services/paymentmethod.service';
// import { StripeModule } from 'stripe-angular';
import { UserService } from '../../services/user.service';
// import { NgxPayPalModule } from 'ngx-paypal';
import { CoinService } from '../../services/coin.service';

@NgModule({
  declarations: [
    TradeComponent,
    MerchantPipe,
    OrderPipe,
    ConfirmPaymentModal,
    OtcPlaceOrderModal,
    MemberDetailModal,
    OtcPlaceOrderErrorModal,
    ApplyForMerchantModal,
    OtcCoinAddressModal,
    OrderComponent,
    MerchantOrdersComponent,
    MemberOrdersComponent,
    OrderDetailComponent,
    UserPaymentMethodsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    //NgxPayPalModule,
    TranslateModule,
    MatInputModule,
    OtcRoutingModule,
    ModalModule.forRoot(),
    OtcMerchantModule
    //StripeModule.forRoot()
  ],
  exports: [
    OrderComponent
  ],
  providers: [AuthGuard, PaymentMethodService, UserService, CoinService]
})
export class OtcModule { }
