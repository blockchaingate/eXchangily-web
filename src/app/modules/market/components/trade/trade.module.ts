import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TradeRoutingModule } from './trade-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TradeComponent } from './trade.component';
import { LiteListComponent } from './litelist/lite-list.component';
import { TvChartContainerComponent } from './tv-chart-container/tv-chart-container.component';
import { MyordersComponent } from './myorder/myorders.component';
import { OrderPadComponent } from './orderpad/order-pad.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PriceService } from '../../../../services/price.service';
import { UtilService } from '../../../../services/util.service';
import { WalletService } from '../../../../services/wallet.service';
import { CoinService } from '../../../../services/coin.service';
import { ApiService } from '../../../../services/api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MockService } from '../../../../services/mock.service';
import { CallbackPipe } from '../../../shared/pipes/callback.pipe';
import { OrderFilterPipe } from './pipes/order-filter.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { SharedModule } from '../../../shared/shared.module';
import { PanelComponent } from './panel/panel.component';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,
        HttpClientModule,
        RouterModule,
        MatSnackBarModule,
        MatTabsModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        TradeRoutingModule,
        TranslateModule,
        MatTableModule,
        MatSlideToggleModule,
        QRCodeModule,
        ModalModule,
        SharedModule
    ],
    providers: [
        PriceService,
        UtilService,
        WalletService,
        CoinService,
        ApiService,
        MockService
    ],
    declarations: [
        TradeComponent,
        PanelComponent,
        LiteListComponent,
        TvChartContainerComponent,
        MyordersComponent,
        OrderPadComponent,
        CallbackPipe,
        ReceiveCoinModal,
        OrderFilterPipe,
        WithdrawHistoryComponent
    ],
    exports: [
        TradeComponent
    ]
})
export class TradeModule { }
