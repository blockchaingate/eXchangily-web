import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { AppResolver } from './modules/landing/resolvers/app/app.resolve';
import { FaqComponent } from './components/help/faq.component';
import { SubscriptionComponent } from './modules/landing/features/subscription/subscription.component';

const routes: Routes = [
  {
    path: 'explorer',
    loadChildren: () => import('./modules/kanbanexplorer/kanbanexplorer.module').then(m => m.KanbanExplorerModule)
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
/*  {
    resolve: {
      app: AppResolver
    },
    path: '',
    loadChildren: () => import('./modules/landing/features/home/home.module').then(m => m.HomeModule),
    // loadChildren: './modules/landing/features/home/home.module#HomeModule',
    data: {
      title: 'Exchangily',
      isHome: true,
      metatags: {
        description: 'Exchangily is a type of decentralized cryptocurrency exchange. Decentralized cryptocurrency exchanges are a new generation of peer-to-peer (P2P) platforms that will be more transparent in operations and fees than the current exchange model.',
        keywords: 'blockchain, cryptocurrency, enterprise, exchangily'
      }
    }
  },
  */
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
    resolve: {
      app: AppResolver
    },
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
  { path: 'faq', component: FaqComponent },
  { path: 'subscription', component: SubscriptionComponent },
  {
    path: '', redirectTo: '/market/home', pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
