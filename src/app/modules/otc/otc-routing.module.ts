import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';
import { OrderComponent } from './components/order/order.component';
import { ListingComponent } from './components/otc-merchant/listing/listing.component';

const routes: Routes = [
  { path: 'trade', component: TradeComponent },
  { path: 'order', component: OrderComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'otc-merchant', loadChildren: './components/otc-merchant/otc-merchant.module#OtcMerchantModule'},
  { path: '', redirectTo: 'trade', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcRoutingModule { }
