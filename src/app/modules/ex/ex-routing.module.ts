import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeComponent } from './components/code/code.component';
import { CoinbaseComponent } from './components/coinbase/coinbase.component';
import { HistoryComponent } from './components/history/history.component';
import { WalletconnectComponent } from './components/walletconnect/walletconnect.component';
import { PairComponent } from './components/pair/pair.component';
import { TokenComponent } from './components/token/token.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'walletconnect', component: WalletconnectComponent },
  { path: 'coinbase', component: CoinbaseComponent },
  { path: 'pair', component: PairComponent },
  { path: 'token', component: TokenComponent },
  { path: ':code', component: CodeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExRoutingModule { }