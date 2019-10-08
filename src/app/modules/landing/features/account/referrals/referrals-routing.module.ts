import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderComponent } from '../order/order.component';
import { ReferralsComponent } from './referrals.component';
import { InfoComponent } from './info/info.component';

import { ViewReferralsComponent } from './view-referrals/view-referrals.component';
import { IcotxResolver, IcotxParentResolver } from '../../../resolvers/icotx/icotx.resolve';
import { UserResolver, UserAdminResolver } from '../../../resolvers/user/user.resolve';
import { AppUsersResolver, ChildReferralsResolver } from '../../../resolvers/app-users/app-users.resolve';

import { ReferralModule } from './referrals.module';

const routes: Routes = [
  {
    path: '',
    component: ReferralsComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        resolve: {
          appUser: AppUsersResolver,
          user: UserResolver,
          referrals: ChildReferralsResolver
        },
        path: 'dashboard',
        component: InfoComponent
      },
      {
        resolve: {
          appUser: AppUsersResolver,
          user: UserResolver,
          referrals: ChildReferralsResolver
        },
        children: [
          {
            path:  ':icotx',
            resolve: {
              icotx: IcotxParentResolver,
              isAdmin: UserAdminResolver
            },
            component: OrderComponent
          }
        ],
        path: 'view',
        component: ViewReferralsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule { }

