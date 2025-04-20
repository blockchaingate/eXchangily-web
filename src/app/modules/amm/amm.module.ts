import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AmmRoutingModule } from './amm-routing.module';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { KanbanService } from '../../services/kanban.service';
import { Web3Service } from '../../services/web3.service';
import { WalletService } from '../../services/wallet.service';
import { AlertService } from '../../services/alert.service';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import { SharedModule} from '../../modules/shared/shared.module';
import { SwapComponent } from './swap/swap.component';
import { AddComponent } from './add/add.component';
import { AmmComponent } from './amm.component';

@NgModule({
    imports: [
        CommonModule,
        AmmRoutingModule,
        TranslateModule,
        FormsModule,
        MatSelectModule,
        CommonModule,
        MatFormFieldModule,
        SharedModule,
        ModalModule.forRoot()
    ],
    providers: [
        ApiService,
        UtilService,
        CoinService,
        KanbanService,
        Web3Service,
        WalletService,
        AlertService
    ],
    declarations: [
        SwapComponent,
        AddComponent,
        AmmComponent
    ],
    exports: [
    ]
})
export class AmmModule { }