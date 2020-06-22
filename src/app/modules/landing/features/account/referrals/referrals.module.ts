import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../components/components.module';
import { ClipboardModule } from 'ngx-clipboard';

import { ReferralsRoutingModule } from './referrals-routing.module';

import { AuthGuard } from '../../../guards/auth/auth.guard';
import { IcotxService } from '../../../service/icotx/icotx.service';

import { ViewReferralsComponent } from './view-referrals/view-referrals.component';
import { OrderComponent } from '../order/order.component';
import { IcotxComponent } from '../components/icotx/icotx.component';
import { ReferralsComponent } from './referrals.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReferralsRoutingModule,
    ComponentsModule,
    ClipboardModule
  ],
  providers: [
    AuthGuard,
    IcotxService
  ],
  declarations: [
    ReferralsComponent,
    ViewReferralsComponent,
    OrderComponent,
    IcotxComponent,
    InfoComponent
  ],
  exports: [
    OrderComponent,
    IcotxComponent
  ]
})
export class ReferralModule {  }

