import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatHomeComponent } from './components/home/chat-home.component';

const routes: Routes = [
  { path: 'home', component: ChatHomeComponent },
//  { path: 'list', component: MarketListComponent },
//  { path: 'withdraw_history/:address', component: WithdrawHistoryComponent },
//  { path: 'market/trade/auto', component: TradeAutoComponent },
//  { path: 'market/trade/:pair', component: TradeComponent },
//  { path: 'trade', component: TradeComponent },
//  { path: 'trade', loadChildren: () => import('./components/trade/trade.module').then(m => m.TradeModule) },
//  { path: 'tvchart/:pair', component: TvChartContainerComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
