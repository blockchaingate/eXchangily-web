import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketHomeComponent } from './components/home/market-home.component';
import { MarketListComponent } from './components/list/market-list.component';
import { TradeComponent } from './components/trade/trade.component';
import { TradeAutoComponent } from './components/trade-auto/trade-auto.component';
import { TvChartContainerComponent } from './components/trade/tv-chart-container/tv-chart-container.component';

const routes: Routes = [
  { path: 'market/home', component: MarketHomeComponent },
  { path: 'market/list', component: MarketListComponent },
  { path: 'market/trade/auto', component: TradeAutoComponent },
  { path: 'market/trade/:pair', component: TradeComponent },
  { path: 'market/tvchart/:pair', component: TvChartContainerComponent },
  { path: 'market', redirectTo: 'market/home', pathMatch: 'full' },
  { path: '', redirectTo: 'market/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
