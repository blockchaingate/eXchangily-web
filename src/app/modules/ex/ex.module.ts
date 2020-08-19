import { NgModule } from '@angular/core';
import { ExRoutingModule } from './ex-routing.module';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { KanbanService } from '../../services/kanban.service';
import { Web3Service } from '../../services/web3.service';
import { WalletService } from '../../services/wallet.service';
import { AlertService } from '../../services/alert.service';
import { CodeComponent } from './components/code/code.component';

@NgModule({
    imports: [
        ExRoutingModule,
        TranslateModule,
        FormsModule,
        CommonModule,
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
        CodeComponent
    ],
    exports: [
    ]
})
export class ExModule { }