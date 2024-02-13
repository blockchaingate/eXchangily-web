import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { AppResolver } from './modules/landing/resolvers/app/app.resolve';
import { FaqComponent } from './components/help/faq.component';
import { FeeComponent } from './components/help/fee.component';
import { HelpComponent } from './components/help/help.component';
import { SubscriptionComponent } from './modules/landing/features/subscription/subscription.component';
import { SupportComponent } from './modules/support/support.component';
import { TicketComponent } from './modules/support/ticket/ticket.component';
import { TicketAddComponent } from './modules/support/ticket-add/ticket-add.component';
import { NewsComponent } from './modules/news/news.component';
import { AppIntroComponent } from './modules/app-intro/app-intro.component';
import { AnnouncementListComponent } from './components/help/announcement/announcement-list/announcement-list.component';
import { ListingComponent } from './modules/listing/listing.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { DusdComponent } from './components/dusd/dusd.component';
import { DonwloadComponent } from './components/donwload/donwload.component';

const routes: Routes = [
  {
    path: 'privacy', component: PrivacyComponent
  },
  {
    path: 'dusd', component: DusdComponent
  },
  {
    path: 'explorer',
    loadChildren: () => import('./modules/kanbanexplorer/kanbanexplorer.module').then(m => m.KanbanExplorerModule)
  },
  {
    path: 'listing',
    component: ListingComponent
  },
  {
    path: 'assets',
    loadChildren: () => import('./components/coin/coin.module').then(c => c.CoinModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./modules/wallet/wallet.module').then(m => m.WalletModule)
  },
  {
    path: 'otc',
    loadChildren: () => import('./modules/otc/otc.module').then(m => m.OtcModule)
  },
  {
    path: 'bulk',
    loadChildren: () => import('./modules/bulk-transfer/bulk-transfer.module').then(m => m.BulkTransferModule)
  },  
  {
    path: 'ex',
    loadChildren: () => import('./modules/ex/ex.module').then(m => m.ExModule)
  },
  {
    path: 'amm',
    loadChildren: () => import('./modules/amm/amm.module').then(m => m.AmmModule)
  },  
  {
    path: 'reward',
    loadChildren: () => import('./modules/reward/reward.module').then(m => m.RewardModule)
  },
  {
    path: 'issue',
    loadChildren: () => import('./modules/issue-token/issue-token.module').then(m => m.IssueTokenModule)
  },  
  {
    path: 'bindpay',
    loadChildren: () => import('./modules/bindpay/bindpay.module').then(m => m.BindpayModule)
  },
  {
    path: 'market',
    loadChildren: () => import('./modules/market/market.module').then(m => m.MarketModule),
    data: {
      title: 'cryptocurrency market | buy bitcoin | btc/usdt | bitcoin price',
      metatags: {
        description: 'crypto market price, trade BTC, ETH, LTC, DOGE, FAB, USDT, bitcoin price trend.'
      }
    }
  },
  {
    path: 'promotion',
    loadChildren: () => import('./modules/promotion/promotion.module').then(m => m.PromotionModule)
  },
  {
    path: 'smartcontract',
    loadChildren: () => import('./modules/smartcontract/smartcontract.module').then(m => m.SmartcontractModule)
  },
  // { path: 'explorer', loadChildren: './modules/kanbanexplorer/kanbanexplorer.module#KanbanExplorerModule' },
  // { path: 'wallet', loadChildren: './modules/wallet/wallet.module#WalletModule' },
  // { path: 'otc', loadChildren: './modules/otc/otc.module#OtcModule' },
  // { path: 'promotion', loadChildren: './modules/promotion/promotion.module#PromotionModule' },
  // { path: 'smartcontract', loadChildren: './modules/smartcontract/smartcontract.module#SmartcontractModule' },
  {
    resolve: {
      app: AppResolver
    },
    path: 'home',
    loadChildren: () => import('./modules/landing/features/home/home.module').then(m => m.HomeModule),
    // loadChildren: './modules/landing/features/home/home.module#HomeModule',
    data: {
      title: 'Exchangily',
      isHome: true,
      metatags: {
        description: 'The best cryptocurrency exchange with open source digital currency wallet, trade Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), FAB, USDT.',
        keywords: 'Bitcoin Exchange, trade bitcoin, decentralized exchange, btc/usdt, eth/usdt, dex'
      }
    }
  },
  {
    path: 'launchpad',
    loadChildren: () => import('./modules/launchpad/launchpad.module').then(m => m.LaunchpadModule)
  },
  {
    resolve: {
      app: AppResolver
    },
    path: 'login',
    loadChildren: () => import('./modules/landing/features/login/login.module').then(m => m.LoginModule),
    // loadChildren: './modules/landing/features/login/login.module#LoginModule',
    data: {
      title: 'Exchangily Login',
      isHome: false
    }
  },
  {
    resolve: { app: AppResolver },
    path: 'account',
    loadChildren: () => import('./modules/landing/features/account/account.module').then(m => m.AccountModule),
    // loadChildren: './modules/landing/features/account/account.module#AccountModule',
    data: {
      title: 'Exchangily Account',
      isHome: false
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/landing/features/admin/admin.module').then(m => m.AdminModule)
    /*
    loadChildren: './modules/landing/features/admin/admin.module#AdminModule',
    data: {
      title: 'Exchangily Admin',
      isHome: false
    }
    */
  },
  {
    path: 'chat', loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'club', loadChildren: () => import('./modules/club/club.module').then(m => m.ClubModule)
  },
  {
    path: 'metaforce', loadChildren: () => import('./modules/metaforce/metaforce.module').then(m => m.MetaforceModule)
  },
  { path: 'help', component: HelpComponent },
  { path: 'manual', loadChildren: () => import('./modules/manual/manual.module').then(m => m.ManualModule) },
  { path: 'faq', component: FaqComponent },
  { path: 'fee', component: FeeComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'app', component: AppIntroComponent },
  { path: 'download', component: DonwloadComponent },
  { path: 'support', component: SupportComponent },
  { path: 'tickets', component: TicketComponent },
  { path: 'ticket-add', component: TicketAddComponent },
  { path: 'news', component: NewsComponent },
//  { path: 'coin/:symbol', component: CoininfoComponent },
  { path: 'announcements', component: AnnouncementListComponent },
  { path: 'announcements/:lang', component: AnnouncementListComponent },
  { path: '', redirectTo: '/market/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
