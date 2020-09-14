import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PeriodComponent } from './components/period/period.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'period/:id', component: PeriodComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardRoutingModule { }