import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeComponent } from './components/trade/trade.component';
import { OtcRoutingModule } from './otc-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { OtcPlaceOrderModal } from './modals/otc-place-order/otc-place-order';
import { ApplyForMerchantModal } from './modals/apply-for-merchant/apply-for-merchant';
import { ConfirmPaymentModal } from './modals/confirm-payment/confirm-payment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MerchantPipe } from './pipes/merchant.pipe';
import { PaymentmethodComponent } from './components/paymentmethod/paymentmethod.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { OrderComponent } from './components/order/order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ListComponent } from './components/otc-merchant/list/list.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CampaignComponent } from './components/campaign/campaign.component';
import { SharedModule } from '../shared/shared.module';
import { ApplyAsMerchantComponent } from './components/apply-as-merchant/apply-as-merchant.component';

@NgModule({
  declarations: [
    TradeComponent, MerchantPipe, PaymentmethodComponent, ConfirmPaymentModal,
    OtcPlaceOrderModal, ApplyForMerchantModal, OrderComponent, ListComponent, CampaignComponent,ApplyAsMerchantComponent
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
    SharedModule,
    MatInputModule,
    OtcRoutingModule,
    ModalModule
  ]
})
export class OtcModule { }
