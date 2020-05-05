import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { PaymentMethodsComponent } from './paymentmethods/paymentmethods.component';
import { AddcoinComponent } from './coin/addcoin.component';
import { OrderEditComponent } from './order/order-edit.component';
import { MembersComponent } from './members/members.component';
import { OrderManagementComponent } from './order/order-mngmt.component';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { KycComponent } from './kyc/kyc.component';
import { KycsComponent } from './kyc/kycs.component';
import { TokenlockComponent } from './tokenlock/tokenlock.component';
import { CampaignOrdersComponent } from './campaign-orders/campaign-orders.component';
import { MerchantComponent } from './merchant/merchant.component';
import { OtcListingComponent } from './otc/otc-listing/otc-listing.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
        {
            path: 'addcoin',
            component: AddcoinComponent
        },
        {
            path: 'merchant',
            component: MerchantComponent
        }, 
        {
            path: 'paymentmethods',
            component: PaymentMethodsComponent
        },         
        {
            path: 'members',
            component: MembersComponent
        },                
        {
            path: 'order-edit/:id',
            component: OrderEditComponent
        },
        {
            path: 'campaign-orders',
            component: CampaignOrdersComponent
        },        
        {
            path: 'order-mngmt',
            component: OrderManagementComponent
        },
        {
            path: 'otc-listing',
            component: OtcListingComponent
        },        
        {
            path: 'kyc/:id',
            component: KycComponent
        },
        {
            path: 'kycs',
            component: KycsComponent
        },
        {
            path: 'tokenlock',
            component: TokenlockComponent
        },
        {
            path: '',
            redirectTo: 'order-mngmt'
        }
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
