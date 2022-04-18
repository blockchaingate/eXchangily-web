import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeComponent } from './components/code/code.component';
import { HistoryComponent } from './components/history/history.component';
import { WalletconnectComponent } from './components/walletconnect/walletconnect.component';
import { WalletconnectClientComponent } from './components/walletconnect-client/walletconnect-client.component';
const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'walletconnect', component: WalletconnectComponent },
  { path: 'walletconnect-client', component: WalletconnectClientComponent },
  { path: ':code', component: CodeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExRoutingModule { }