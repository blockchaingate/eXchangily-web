import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeComponent } from './components/trade/trade.component';
import { OtcRoutingModule } from './otc-routing.module';
import {MatSelectModule} from '@angular/material/select';
import { OtcPlaceOrderModal } from './modals/otc-place-order/otc-place-order';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MerchantPipe } from './pipes/merchant.pipe';
import { PaymentmethodComponent } from './components/paymentmethod/paymentmethod.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TradeComponent, MerchantPipe, PaymentmethodComponent, OtcPlaceOrderModal],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatSelectModule,
    OtcRoutingModule,
    ModalModule
  ]
})
export class OtcModule { }
