import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BindpayRoutingModule } from './bindpay-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { BindpayComponent } from './bindpay.component';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TimerService } from '../../services/timer.service';
import { WalletService } from '../../services/wallet.service';
import { CoinService } from '../../services/coin.service';
@NgModule({
    declarations: [
        BindpayComponent,
        TransactionHistoryComponent,
        ReceiveCoinModal
    ],
    imports: [
        CommonModule,
        TranslateModule,
        SharedModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ModalModule.forRoot(),
        BindpayRoutingModule
    ],
    providers: [
        TimerService,
        WalletService,
        CoinService
    ],
    exports: [
        BindpayComponent
    ]
})

export class BindpayModule { }