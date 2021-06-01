import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { PaymentMethodsComponent } from './paymentmethods/paymentmethods.component';
import { AddcoinComponent } from './coin/addcoin.component';
import { OrderEditComponent } from './order/order-edit.component';
import { OrdersComponent } from './otc/orders/orders.component';
import { MembersComponent } from './members/members.component';
import { OrderManagementComponent } from './order/order-mngmt.component';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { KycComponent } from './kyc/kyc.component';
import { KycsComponent } from './kyc/kycs.component';
import { TokenlockComponent } from './tokenlock/tokenlock.component';
import { CampaignOrdersComponent } from './campaign-orders/campaign-orders.component';
import { MerchantComponent } from './merchant/merchant.component';
import { OtcListingComponent } from './otc/otc-listing/otc-listing.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementAddComponent } from './announcement-add/announcement-add.component';
import { StarOrdersComponent } from './star-orders/star-orders.component';
import { StarSettingsComponent } from './star-settings/star-settings.component';
import { StarSettingAddComponent } from './star-setting-add/star-setting-add.component';
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
            path: 'star-orders',
            component: StarOrdersComponent
        },  
        {
            path: 'star-settings',
            component: StarSettingsComponent
        }, 
        {
            path: 'star-setting/add',
            component: StarSettingAddComponent
        },         
        {
            path: 'star-setting/:id/edit',
            component: StarSettingAddComponent
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
            path: 'otc-orders',
            component: OrdersComponent
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
            path: 'announcements',
            component: AnnouncementsComponent
        },
        {
            path: 'announcements-add',
            component:AnnouncementAddComponent
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
