import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentsModule } from '../../components/components.module';

import { NoAuthGuard } from '../../guards/no-auth/no-auth.guard';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { ReferralModule } from '../account/referrals/referrals.module';

import { AdminComponent } from './admin.component';
import { AddcoinComponent } from './coin/addcoin.component';
import { OrderEditComponent } from './order/order-edit.component';
import { OrderManagementComponent } from './order/order-mngmt.component';
import { KycComponent } from './kyc/kyc.component';
import { KycsComponent } from './kyc/kycs.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AppService } from '../../service/app-service/app.service';
import { OrderItemComponent } from './order/order-item.component';
import { TokenlockService } from '../../service/tokenlock/tokenlock.service';
import { TokenlockComponent } from './tokenlock/tokenlock.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    FlexLayoutModule,
    AdminRoutingModule,
    ReferralModule,
    MatDialogModule
  ],
  providers: [AuthGuard, NoAuthGuard, TokenlockService],
  declarations: [
    AdminComponent,
    AddcoinComponent,
    OrderEditComponent,
    OrderManagementComponent,
    KycComponent,
    KycsComponent,
    OrderItemComponent,
    TokenlockComponent
  ]
})
export class AdminModule {}
