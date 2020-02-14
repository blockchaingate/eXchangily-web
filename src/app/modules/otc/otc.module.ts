import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeComponent } from './components/trade/trade.component';
import { OtcRoutingModule } from './otc-routing.module';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MerchantPipe } from './pipes/merchant.pipe';
import { PaymentmethodComponent } from './components/paymentmethod/paymentmethod.component';
@NgModule({
  declarations: [TradeComponent, MerchantPipe, PaymentmethodComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatSelectModule,
    OtcRoutingModule
  ]
})
export class OtcModule { }
