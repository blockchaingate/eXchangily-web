import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualComponent } from './manual.component';
import { ScComponent } from './sc/sc.component';
const routes: Routes = [
  { path: 'home', component: ManualComponent },
  { path: 'sc', component: ScComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualRoutingModule { }