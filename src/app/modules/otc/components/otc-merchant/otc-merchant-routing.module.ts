import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtcMerchantComponent } from './otc-merchant.component';
import { ApplyAsMerchantComponent } from './apply-as-merchant/apply-as-merchant.component';

const routes: Routes = [
  { path: 'apply-to-be-merchant', component: ApplyAsMerchantComponent },
  { path: '', component: OtcMerchantComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcRoutingModule { }
