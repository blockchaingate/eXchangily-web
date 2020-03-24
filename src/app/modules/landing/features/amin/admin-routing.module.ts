import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddcoinComponent } from './coin/addcoin.component';
import { UserResolver, UserAdminResolver } from '../../resolvers/user/user.resolve';
import { IcotxResolver, IcotxParentResolver } from '../../resolvers/icotx/icotx.resolve';
import { OrderEditComponent } from './order/order-edit.component';
import { OrderManagementComponent } from './order/order-mngmt.component';
import { NoAuthGuard } from '../../guards/no-auth/no-auth.guard';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { KycComponent } from './kyc/kyc.component';
import { KycsComponent } from './kyc/kycs.component';
import { TokenlockComponent } from './tokenlock/tokenlock.component';
import { CoinOrdersComponent } from './coin-orders/coin-orders.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
        {
            path: '',
            redirectTo: 'order-mngmt'
        },
        {
            path: 'addcoin',
            component: AddcoinComponent
        },
        {
            path: 'order-edit/:id',
            component: OrderEditComponent
        },
        {
            path: 'coin-orders',
            component: CoinOrdersComponent
        },        
        {
            path: 'order-mngmt',
            component: OrderManagementComponent
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
        }
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
