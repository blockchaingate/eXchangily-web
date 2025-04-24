import { Routes } from '@angular/router';
import { WalletDashboardComponent } from './components/wallet/components/dashboard/dashboard.component';
import { CreateWalletComponent } from './components/wallet/components/create/createwallet.component';
import { NoWalletComponent } from './components/wallet/components/create/no-wallet.component';
import { ConfirmMnemonicsComponent } from './components/wallet/components/create/confirmmnem.component';
import { WalletPwdComponent } from './components/wallet/components/create/wallet-pwd.component';
import { RestoreWalletComponent } from './components/wallet/components/restore/restorewallet.component';
import { RestoreWalletOldComponent } from './components/wallet/components/restoreold/restorewalletold.component';
import { KycComponent } from './components/wallet/components/kyc/kyc.component';
import { KycProcessComponent } from './components/wallet/components/kyc-process/kyc-process.component';

export const routes: Routes = [
    { path: 'privacy', loadComponent: () => import('./components/privacy/privacy.component').then((m) => m.PrivacyComponent) },
    { path: 'dusd', loadComponent: () => import('./components/dusd/dusd.component').then((m) => m.DusdComponent) },
    /*
    {
        path: 'explorer', loadComponent: () => import('./components/kanbanexplorer/kanbanexplorer.component').then((m) => m.KanbanexplorerComponent), children:
            [
                { path: '', loadComponent: () => import('./components/kanbanexplorer/components/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
                { path: 'block-detail/:blockNumber', loadComponent: () => import('./components/kanbanexplorer/components/block-details/block-details.component').then((m) => m.BlockDetailsComponent) },
                { path: 'tx-detail/:txhash', loadComponent: () => import('./components/kanbanexplorer/components/tx-details/tx-details.component').then((m) => m.TxDetailsComponent) },
                { path: 'order-detail/:orderHash', loadComponent: () => import('./components/kanbanexplorer/components/order-detail/order-detail.component').then((m) => m.OrdeDetailComponent) },
                { path: 'address-detail/:address', loadComponent: () => import('./components/kanbanexplorer/components/address-details/address-details.component').then((m) => m.AddressDetailsComponent) },
            ]
    },
    */
    { path: 'listing', loadComponent: () => import('./components/listing/listing.component').then((m) => m.ListingComponent) },
    { path: 'assets', loadComponent: () => import('./components/coin/coins.component').then((m) => m.CoinsComponent) },
    { path: 'assets/:symbol', loadComponent: () => import('./components/coin/coin-info.component').then((m) => m.CoininfoComponent) },
    { path: 'assets/info/:symbol', loadComponent: () => import('./components/coin/coin-info.component').then((m) => m.CoininfoComponent) },
    /*
    { path: 'wallet', loadComponent: () => import('./components/wallet/wallet.component').then((m) => m.WalletComponent), children:
        [
            { path: 'dashboard', component: WalletDashboardComponent },
            { path: 'create', component: CreateWalletComponent },
            { path: 'no-wallet', component: NoWalletComponent },
            { path: 'confirm-words', component: ConfirmMnemonicsComponent },
            { path: 'set-password', component: WalletPwdComponent },
            { path: 'restore', component: RestoreWalletComponent },
            { path: 'restoreold', component: RestoreWalletOldComponent },
            { path: 'kyc', component: KycComponent },
            { path: 'kyc-process', component: KycProcessComponent },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        ]
    },
    */
    { path: 'help', loadComponent: () => import('./components/help/help.component').then((m) => m.HelpComponent) },
    { path: 'faq', loadComponent: () => import('./components/help/faq.component').then((m) => m.FaqComponent) },
    { path: 'fee', loadComponent: () => import('./components/help/fee.component').then((m) => m.FeeComponent) },
    { path: 'subscription', loadComponent: () => import('./components/subscription/subscription.component').then((m) => m.SubscriptionComponent) },
    { path: 'app', loadComponent: () => import('./components/app-intro/app-intro.component').then((m) => m.AppIntroComponent) },
    { path: 'download', loadComponent: () => import('./components/download/download.component').then((m) => m.DownloadComponent) },
    { path: 'support', loadComponent: () => import('./components/support/support.component').then((m) => m.SupportComponent) },
    { path: 'tickets', loadComponent: () => import('./components/support/ticket/ticket.component').then((m) => m.TicketComponent) },
    { path: 'ticket-add', loadComponent: () => import('./components/support/ticket-add/ticket-add.component').then((m) => m.TicketAddComponent) },
    { path: 'news', loadComponent: () => import('./components/news/news.component').then((m) => m.NewsComponent) },
    { path: 'announcements', loadComponent: () => import('./components/help/announcement/announcement-list/announcement-list.component').then((m) => m.AnnouncementListComponent) },
    { path: 'announcements/:lang', loadComponent: () => import('./components/help/announcement/announcement-list/announcement-list.component').then((m) => m.AnnouncementListComponent) },
/*
    {
        path: 'manual', loadComponent: () => import('./components/manual/manual.component').then((m) => m.ManualComponent), children:
            [
                { path: 'home', loadComponent: () => import('./components/manual/manual.component').then((m) => m.ManualComponent) },
                { path: 'sc', loadComponent: () => import('./components/manual/sc/sc.component').then((m) => m.ScComponent) },
                { path: '', redirectTo: './home', pathMatch: 'full' }
            ]
    },
    */
    { path: '', redirectTo: 'market/home', pathMatch: 'full' },
    { path: '**', loadComponent: () => import('./page-not-found.component').then((m) => m.PageNotFoundComponent) },
];
