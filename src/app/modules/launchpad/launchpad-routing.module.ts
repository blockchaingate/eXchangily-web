import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchpadComponent } from './launchpad.component';

const routes: Routes = [
  { path: '', component: LaunchpadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunchpadRoutingModule { }
