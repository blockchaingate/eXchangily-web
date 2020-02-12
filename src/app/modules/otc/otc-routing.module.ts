import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeComponent } from './components/trade/trade.component';

const routes: Routes = [
  { path: 'trade', component: TradeComponent },
  { path: '', redirectTo: 'trade', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcRoutingModule { }