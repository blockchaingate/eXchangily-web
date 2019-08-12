import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: 'explorer', loadChildren: './modules/explorer/explorer.module#ExplorerModule'},
  { path: 'wallet', loadChildren: './modules/wallet/wallet.module#WalletModule'},
  { path: '', redirectTo: 'market', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
