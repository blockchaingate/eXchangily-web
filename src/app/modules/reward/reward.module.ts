import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RewardRoutingModule } from './reward-routing.module';
import { IndexComponent } from './components/index/index.component';
import { PeriodComponent } from './components/period/period.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { KanbanService } from '../../services/kanban.service';
import { RewardService } from '../../services/reward.service';
import { WalletService } from '../../services/wallet.service';
import { AlertService } from '../../services/alert.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
    imports: [
        CommonModule,
        RewardRoutingModule,
        TranslateModule,
        FormsModule,
        MatSelectModule,
        CommonModule,
        MatFormFieldModule,
        ModalModule.forRoot()
    ],
    providers: [
        ApiService,
        UtilService,
        CoinService,
        KanbanService,
        RewardService,
        WalletService,
        AlertService
    ],
    declarations: [
        IndexComponent,
        PeriodComponent
    ],
    exports: [
    ]
})
export class RewardModule { }