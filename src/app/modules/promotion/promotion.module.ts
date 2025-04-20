import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { IndexComponent } from './components/index/index.component';
import { MainComponent } from './components/main/main.component';
import { FlyerComponent } from './components/flyer/flyer.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { FormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SharedModule } from '../shared/shared.module';
import { RewardComponent } from './components/reward/reward.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { CampaignOrderService } from '../../services/campaignorder.service';
import { ChartistModule } from 'ng-chartist';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { MemberModal } from './modals/member/member.component';
import { TeamModal } from './modals/team/team.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CoinService } from '../../services/coin.service';

@NgModule({
  declarations: [IndexComponent, MainComponent, RewardComponent, FlyerComponent, MemberModal, TeamModal],
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    SharedModule,
    MatTreeModule,
    MatIconModule,
    ChartistModule,
    QRCodeModule,
    ModalModule.forRoot(),
    MatDialogModule,
    MatExpansionModule,
    PromotionRoutingModule
  ],
  providers: [
    CampaignOrderService, CoinService
  ]
})
export class PromotionModule { }
