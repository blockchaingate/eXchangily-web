import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { InfoComponent } from './info/info.component';
// import { DetailsComponent } from './details/details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { PlaceOrderComponent } from './place-order/order-page/place-order.component';
import { ConfirmPageComponent } from './place-order/confirm-page/confirm-page.component';
import { KycComponent } from './kyc/kyc.component';
// import { ViewReferralsComponent } from './view-referrals/view-referrals.component';
import { PlaceOrderFormComponent } from './place-order/place-order-form/place-order-form.component';
import { OrderComponent } from './order/order.component';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { AccountPaths } from '../../paths/account-paths';
import { OtcListingComponent } from './otc-listing/otc-listing.component';
import { SecurityComponent } from './security/security.component';
import { MerchantComponent } from './merchant/merchant.component';
// import { AdminModule } from '../admin/admin.module';
import { UserResolver, UserAdminResolver } from '../../resolvers/user/user.resolve';
import { IcotxResolver, IcotxParentResolver } from '../../resolvers/icotx/icotx.resolve';
import { AppUsersResolver, ChildReferralsResolver } from '../../resolvers/app-users/app-users.resolve';
// import { ReferralModule } from './referrals/referrals.module';
import { OtcOrderComponent } from './otc-order/otc-order.component';
import { MyOtcOrderComponent } from './my-otc-order/my-otc-order.component';

const routes: Routes = [
{
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {

        path: 'user-info',
        component: InfoComponent
      },
      {
        path: AccountPaths[1].relative,
        component: KycComponent
      },
      {
        path: AccountPaths[5].relative,
        component: MerchantComponent
      },   
      {
        path: 'otc-listing',
        component: OtcListingComponent
      },     
      {
        path: 'otc-order',
        component: OtcOrderComponent
      },   
      {
        path: 'my-otc-order',
        component: MyOtcOrderComponent
      },           
      {
        path: AccountPaths[6].relative,
        component: SecurityComponent
      },      
      {
        path: 'create-new-payment', redirectTo: '/promotion/main', pathMatch: 'full'  //  remove this line when resotre after campaign.
        /* Disabled temporily, will restore after campaign
        path: AccountPaths[2].relative,
        component: PlaceOrderFormComponent,
        children: [
          {
            path: '',
            component: PlaceOrderComponent
          },
          {
            resolve: {
              user: UserResolver
            },
            path: 'review',
            component: ConfirmPageComponent
          }
        ]
        */
      },
      {
        resolve: {
          user: UserResolver,
          isAdmin: UserAdminResolver
        },
        path: AccountPaths[3].relative,
        component: OrderListComponent,
        children: [
          {
            path:  ':icotx',
            resolve: {
              icotx: IcotxResolver,
              isAdmin: UserAdminResolver
            },
            component: OrderComponent
          }
        ]
      },
      {
        path: 'referrals', redirectTo: '/promotion/main', pathMatch: 'full'  //  remove this line when resotre after campaign.
        /* Disabled temporily, will restore after campaign
        path: AccountPaths[4].relative,
        loadChildren: './referrals/referrals.module#ReferralModule'
        */
      },
      {
        path: 'admin',
        loadChildren: '../admin/admin.module#AdminModule'
      }
      ,
      {
        path: 'logout',
        loadChildren: '../admin/admin.module#AdminModule'
      },
      {
        path: '',
        redirectTo: AccountPaths[1].relative,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
