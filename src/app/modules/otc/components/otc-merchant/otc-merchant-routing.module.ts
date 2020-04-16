import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../landing/guards/auth/auth.guard';
import { OtcMerchantComponent } from './otc-merchant.component';
import { MerchantApplicationComponent } from './merchant-application/merchant-application.component';
import { ListingComponent } from './listing/listing.component';

const routes: Routes = [
  {
      path: '', component: OtcMerchantComponent,
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children: [
        { path: '', redirectTo: 'listing'},
        { path: 'listing', component: ListingComponent },
        { path: 'merchant-application', component: MerchantApplicationComponent }

      ]
    }
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcMerchantRoutingModule {}
