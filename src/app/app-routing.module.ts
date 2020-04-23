import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { AppResolver } from './modules/landing/resolvers/app/app.resolve';

const routes: Routes = [

  { path: 'explorer', loadChildren: './modules/explorer/explorer.module#ExplorerModule' },
  { path: 'wallet', loadChildren: './modules/wallet/wallet.module#WalletModule' },
  { path: 'otc', loadChildren: './modules/otc/otc.module#OtcModule' },
  { path: 'promotion', loadChildren: './modules/promotion/promotion.module#PromotionModule' },
  { path: 'smartcontract', loadChildren: './modules/smartcontract/smartcontract.module#SmartcontractModule' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    resolve: {
      app: AppResolver
    },
    path: 'home',
    loadChildren: './modules/landing/features/home/home.module#HomeModule',
    data: {
      title: 'Exchangily',
      isHome: true,
      metatags: {
        description: 'Exchangily is a type of decentralized cryptocurrency exchange. Decentralized cryptocurrency exchanges are a new generation of peer-to-peer (P2P) platforms that will be more transparent in operations and fees than the current exchange model.',
        keywords: 'blockchain, cryptocurrency, enterprise, exchangily'
      }
    }
  },
  {
    resolve: {
      app: AppResolver
    },
    path: 'login',
    loadChildren: './modules/landing/features/login/login.module#LoginModule',
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
    loadChildren: './modules/landing/features/account/account.module#AccountModule',
    data: {
      title: 'Exchangily Account',
      isHome: false
    }
  },
  {
    resolve: {
      app: AppResolver
    },
    path: 'admin',
    loadChildren: './modules/landing/features/admin/admin.module#AdminModule',
    data: {
      title: 'Exchangily Admin',
      isHome: false
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
