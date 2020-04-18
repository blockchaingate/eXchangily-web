import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { MainComponent } from './components/main/main.component';
import { RewardComponent } from './components/reward/reward.component';
import { FlyerComponent } from './components/flyer/flyer.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'main', component: MainComponent },
  { path: 'reward', component: RewardComponent },
  { path: 'flyer', component: FlyerComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }