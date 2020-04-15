import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtcMerchantComponent } from './otc-merchant.component';
import { MerchantApplicationComponent } from './merchant-application/merchant-application.component';

const routes: Routes = [
  { path: 'merchant-application', component: MerchantApplicationComponent },
  { path: '', component: OtcMerchantComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcMerchantRoutingModule {}
