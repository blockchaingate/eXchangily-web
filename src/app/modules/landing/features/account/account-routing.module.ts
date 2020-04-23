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

// import { AdminModule } from '../admin/admin.module';
import { UserResolver, UserAdminResolver } from '../../resolvers/user/user.resolve';
import { IcotxResolver, IcotxParentResolver } from '../../resolvers/icotx/icotx.resolve';
import { AppUsersResolver, ChildReferralsResolver } from '../../resolvers/app-users/app-users.resolve';
// import { ReferralModule } from './referrals/referrals.module';

const routes: Routes = [
{
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: AccountPaths[0].relative,
      },
      {
        resolve: {
          appUser: AppUsersResolver
        },
        path: AccountPaths[0].relative,
        component: InfoComponent
      },
      {
        path: AccountPaths[1].relative,
        component: KycComponent
      },
      {
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
        /*
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
