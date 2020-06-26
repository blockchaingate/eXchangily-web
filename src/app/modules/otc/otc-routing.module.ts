import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';
import { MemberOrdersComponent } from './components/member-orders/member-orders';
import { MerchantOrdersComponent } from './components/merchant-orders/merchant-orders';
import { ListingComponent } from './components/otc-merchant/listing/listing.component';
import { UserPaymentMethodsComponent } from './components/userpaymentmethods/userpaymentmethods.component';

const routes: Routes = [
  { path: 'trade', component: TradeComponent },
  { path: 'member-orders', component: MemberOrdersComponent },
  { path: 'merchant-orders', component: MerchantOrdersComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'userpaymentmethods', component: UserPaymentMethodsComponent },
  //{ path: 'otc-merchant', loadChildren: './components/otc-merchant/otc-merchant.module#OtcMerchantModule'},
  {
    path: 'otc-merchant',
    loadChildren: () => import('./components/otc-merchant/otc-merchant.module').then(m => m.OtcMerchantModule)
  },

  { path: '', redirectTo: 'trade', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcRoutingModule { }
