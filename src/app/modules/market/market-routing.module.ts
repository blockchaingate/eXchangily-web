import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketHomeComponent } from './components/home/market-home.component';
import { MarketListComponent } from './components/list/market-list.component';
// import { TradeComponent } from './components/trade/trade.component';
import { WithdrawHistoryComponent } from './components/trade/withdraw-history/withdraw-history.component';
// import { TradeAutoComponent } from './components/trade-auto/trade-auto.component';
import { TvChartContainerComponent } from './components/trade/tv-chart-container/tv-chart-container.component';

const routes: Routes = [
  { path: 'home', component: MarketHomeComponent },
  { path: 'list', component: MarketListComponent },
  { path: 'withdraw_history/:address', component: WithdrawHistoryComponent },
//  { path: 'market/trade/auto', component: TradeAutoComponent },
//  { path: 'market/trade/:pair', component: TradeComponent },
//  { path: 'trade', component: TradeComponent },
  {
    path: 'trade',
    loadChildren: () => import('./components/trade/trade.module').then(m => m.TradeModule)
  },
  // { path: 'tvchart/:pair', component: TvChartContainerComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
