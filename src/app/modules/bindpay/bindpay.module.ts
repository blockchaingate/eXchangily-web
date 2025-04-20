import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { QRCodeModule } from 'angularx-qrcode';
import { BindpayRoutingModule } from './bindpay-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { BindpayComponent } from './bindpay.component';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TimerService } from 'src/app/services/timer.service';
import { WalletService } from 'src/app/services/wallet.service';
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
        QRCodeModule,
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