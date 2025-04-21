import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { WalletDashboardComponent } from './components/dashboard/dashboard.component';
import { NoWalletComponent } from './components/create/no-wallet.component';
import { MnemonicComponent } from './components/mnemonic/mnemonic.component';
import { MnemeditComponent } from './components/mnemonic/mnemedit.component';
import { CreateWalletComponent } from './components/create/createwallet.component';
import { ConfirmMnemonicsComponent } from './components/create/confirmmnem.component';
import { ManageWalletComponent } from './components/manage-wallet/manage-wallet.component';
import { FaqComponent } from './components/faq/faq.component';
import { WalletPwdComponent } from './components/create/wallet-pwd.component';
import { RestoreWalletComponent } from './components/restore/restorewallet.component';
import { RestoreWalletOldComponent } from './components/restoreold/restorewalletold.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { AddressKeyComponent } from './modals/components/address-key/address-key.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TransactionDetailModal } from './modals/transaction-detail/transaction-detail.modal';
import { TransactionDetailModal2 } from './modals/transaction-detail2/transaction-detail2.modal';
import { AddAssetsModal } from './modals/add-assets/add-assets.modal';
import { SendCoinModal } from './modals/send-coin/send-coin.modal';
import { BuyCoinModal } from './modals/buy-coin/buy-coin.modal';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.modal';
import { DepositAmountModal } from './modals/deposit-amount/deposit-amount.modal';
import { RedepositAmountModal } from './modals/redeposit-amount/redeposit-amount.modal';
import { AddGasModal } from './modals/add-gas/add-gas.modal';
import { ToolsModal } from './modals/tools/tools.modal';
import { ShowSeedPhraseModal } from './modals/show-seed-phrase/show-seed-phrase.modal';
import { VerifySeedPhraseModal } from './modals/verify-seed-phrase/verify-seed-phrase.modal';
import { BackupPrivateKeyModal } from './modals/backup-private-key/backup-private-key.modal';
import { DeleteWalletModal } from './modals/delete-wallet/delete-wallet.modal';
import { GetFreeFabModal } from './modals/get-free-fab/get-free-fab.modal';
import { LoginSettingModal } from './modals/login-setting/login-setting.modal';
import { LockedInfoModal } from './modals/locked-info/locked-info.modal';
import { DisplaySettingModal } from './modals/display-setting/display-setting.modal';
import { WalletUpdateModal } from './modals/wallet-update/wallet-update.modal';
import { KanbanService } from '../../services/kanban.service';
import { AirdropService } from '../../services/airdrop.service';
import { CampaignOrderService } from '../../services/campaignorder.service';
import { Web3Service } from '../../services/web3.service';
import { AlertService } from '../../services/alert.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { QRCodeComponent } from 'angularx-qrcode';
import { KycComponent } from './components/kyc/kyc.component';
import { KycProcessComponent } from './components/kyc-process/kyc-process.component';
@NgModule({
    declarations: [
        WalletDashboardComponent,
        NoWalletComponent,
        TransactionTypePipe,
        MnemonicComponent,
        MnemeditComponent,
        TransactionHistoryComponent,
        CreateWalletComponent,
        ConfirmMnemonicsComponent,
        WalletPwdComponent,
        RestoreWalletComponent,
        RestoreWalletOldComponent,
        WalletComponent,
        ManageWalletComponent,
        FaqComponent,
        AddressKeyComponent,
        TransactionDetailModal,
        AddAssetsModal,
        SendCoinModal,
        BuyCoinModal,
        TransactionDetailModal2,
        LockedInfoModal,
        ReceiveCoinModal,
        DepositAmountModal,
        RedepositAmountModal,
        ShowSeedPhraseModal,
        VerifySeedPhraseModal,
        AddGasModal,
        ToolsModal,
        WalletUpdateModal,
        GetFreeFabModal,
        BackupPrivateKeyModal,
        DeleteWalletModal,
        LoginSettingModal,
        DisplaySettingModal,
        KycComponent,
        KycProcessComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WalletRoutingModule,
        MatTabsModule,
        MatListModule,
        MatCheckboxModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatRadioModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatGridListModule,
        MatPaginatorModule,
        SharedModule,
        MatInputModule,
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot(),
        ModalModule.forRoot(),

    ],
    providers: [
        KanbanService, 
        Web3Service,
        AlertService, 
        CampaignOrderService, 
        AirdropService
    ]
})
export class WalletModule { }
