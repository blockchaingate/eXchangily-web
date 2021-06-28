import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoininfoComponent } from './coin-info.component';
import { CoinsComponent } from './coins.component';

const routes: Routes = [
    {
        path: '', component: CoinsComponent,
        children: [
            { path: ':symbol', component: CoininfoComponent }
        ],
    },
    { path: 'info/:symbol', component: CoininfoComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoinRoutingModule { }
