import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';
import { OrderComponent } from './components/order/order.component';
import { ListComponent } from './components/otc-merchant/list/list.component';
import { ApplyAsMerchantComponent } from './components/apply-as-merchant/apply-as-merchant.component';

const routes: Routes = [
  { path: 'trade', component: TradeComponent },
  { path: 'order', component: OrderComponent },
  { path: 'list', component: ListComponent },
  { path: 'apply-to-be-merchant', component: ApplyAsMerchantComponent },
  { path: '', redirectTo: 'trade', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcRoutingModule { }
