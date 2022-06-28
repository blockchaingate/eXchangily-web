import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ExRoutingModule } from './ex-routing.module';
import { CodeComponent } from './components/code/code.component';
import { HistoryComponent } from './components/history/history.component';
import { WalletconnectComponent } from './components/walletconnect/walletconnect.component';
//import { WalletconnectClientComponent } from './components/walletconnect-client/walletconnect-client.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { KanbanService } from '../../services/kanban.service';
import { Web3Service } from '../../services/web3.service';
import { WalletService } from '../../services/wallet.service';
import { AlertService } from '../../services/alert.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { SharedModule} from '../../modules/shared/shared.module';
import {MatInputModule} from '@angular/material/input';
import { CoinbaseComponent } from './components/coinbase/coinbase.component';

@NgModule({
    imports: [
        CommonModule,
        ExRoutingModule,
        TranslateModule,
        FormsModule,
        MatSelectModule,
        CommonModule,
        MatFormFieldModule,
        SharedModule,
        MatInputModule,
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
        CodeComponent,
        HistoryComponent,
        WalletconnectComponent,
        CoinbaseComponent,
        //alletconnectClientComponent
    ],
    exports: [
    ]
})
export class ExModule { }