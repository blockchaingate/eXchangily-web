import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { WalletRoutingModule } from './wallet-routing.module';

import { WalletComponent } from './wallet.component';
import { WalletDashboardComponent } from './components/dashboard/dashboard.component';
import { NoWalletComponent } from './components/create/no-wallet.component';
import { MnemonicComponent } from './components/mnemonic/mnemonic.component';
import { MnemeditComponent } from './components/mnemonic/mnemedit.component';
import { CreateWalletComponent } from './components/create/createwallet.component';
import { ConfirmMnemonicsComponent } from './components/create/confirmmnem.component';
import { WalletPwdComponent } from './components/create/wallet-pwd.component';
import { RestoreWalletComponent } from './components/restore/restorewallet.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';

import { QRCodeModule } from 'angular2-qrcode';

import { TransactionHistoryModal } from './modals/transaction-history/transaction-history.modal';
import { AddAssetsModal } from './modals/add-assets/add-assets.modal';
import { SendCoinModal } from './modals/send-coin/send-coin.modal';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.modal';
import { DepositAmountModal } from './modals/deposit-amount/deposit-amount.modal';
import { PinNumberModal } from './modals/pin-number/pin-number.modal';

import { KanbanService } from '../../services/kanban.service';
import { Web3Service } from '../../services/web3.service';
import {MatSelectModule} from '@angular/material/select'; 

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        WalletDashboardComponent,
        NoWalletComponent,
        MnemonicComponent,
        MnemeditComponent,
        CreateWalletComponent,
        ConfirmMnemonicsComponent,
        WalletPwdComponent,
        RestoreWalletComponent,
        WalletComponent,
        TransactionHistoryModal,
        AddAssetsModal,
        SendCoinModal,
        ReceiveCoinModal,
        DepositAmountModal,
        PinNumberModal
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WalletRoutingModule,
        HttpClientModule,
        QRCodeModule,
        MatTabsModule,
        MatListModule,
        MatSelectModule,
        MatSlideToggleModule,
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot(),
        ModalModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    providers: [
        KanbanService, Web3Service
    ]
})
export class WalletModule { }
