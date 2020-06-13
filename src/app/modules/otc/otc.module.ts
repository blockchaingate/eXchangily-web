import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../landing/guards/auth/auth.guard';
import { TradeComponent } from './components/trade/trade.component';
import { OtcRoutingModule } from './otc-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { OtcPlaceOrderModal } from './modals/otc-place-order/otc-place-order';
import { MemberDetailModal } from './modals/member-detail/member-detail.component';
import { OtcPlaceOrderErrorModal } from './modals/otc-place-order-error/otc-place-order-error.component';
import { ApplyForMerchantModal } from './modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from './modals/confirm-payment/confirm-payment';
import { MerchantPipe } from './pipes/merchant.pipe';
import { OrderPipe } from './pipes/order.pipe';
import { PaymentmethodComponent } from './components/paymentmethod/paymentmethod.component';
import { MerchantOrdersComponent } from './components/merchant-orders/merchant-orders';
import { MemberOrdersComponent } from './components/member-orders/member-orders';
import { UserPaymentMethodsComponent } from './components/userpaymentmethods/userpaymentmethods.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { OrderComponent } from './components/order/order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// duplicate component in otc-merchant module
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { OtcMerchantModule } from '../otc/components/otc-merchant/otc-merchant.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentMethodService } from '../../services/paymentmethod.service';
import { StripeModule } from 'stripe-angular';
import { UserService } from '../../services/user.service';
import { NgxPayPalModule } from 'ngx-paypal';
import { CoinService } from '../../services/coin.service';

@NgModule({
  declarations: [
    TradeComponent,
    MerchantPipe,
    OrderPipe,
    PaymentmethodComponent,
    ConfirmPaymentModal,
    OtcPlaceOrderModal,
    MemberDetailModal,
    OtcPlaceOrderErrorModal,
    ApplyForMerchantModal,
    OrderComponent, 
    MerchantOrdersComponent,
    MemberOrdersComponent,
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
    NgxPayPalModule,
    TranslateModule,
    MatInputModule,
    OtcRoutingModule,
    ModalModule.forRoot(),
    OtcMerchantModule,
    StripeModule.forRoot()
  ],
  exports: [
    OrderComponent
  ],
  providers: [AuthGuard,PaymentMethodService,UserService,CoinService]
})
export class OtcModule { }
