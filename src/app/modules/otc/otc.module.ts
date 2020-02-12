import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeComponent } from './components/trade/trade.component';
import { OtcRoutingModule } from './otc-routing.module';


@NgModule({
  declarations: [TradeComponent],
  imports: [
    CommonModule,
    OtcRoutingModule
  ]
})
export class OtcModule { }
