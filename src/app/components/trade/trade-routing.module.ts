import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeComponent } from './trade.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
    {
        path: '', component: TradeComponent,
        children: [
            { path: ':pair', component: PanelComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TradeRoutingModule { }
