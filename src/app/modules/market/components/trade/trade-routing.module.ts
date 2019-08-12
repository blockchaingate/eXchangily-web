import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeComponent } from './trade.component';
import { TradePairComponent } from './tradepair/trade-pair.component';

const routes: Routes = [
    { path: 'market/trade/:pair', component: TradePairComponent },
    { path: 'market/trade', component: TradeComponent },
    { path: '', redirectTo: 'market/trade', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TradeRoutingModule { }
