import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwapComponent } from './swap/swap.component';
import { AddComponent } from './add/add.component';
import { AmmComponent } from './amm.component';

const routes: Routes = [
  { path: '', component: AmmComponent },
  { path: ':exchange/swap', component: SwapComponent },
  { path: ':exchange/add', component: AddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmmRoutingModule { }  