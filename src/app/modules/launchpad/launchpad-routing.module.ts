import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchpadComponent } from './launchpad.component';
import { IntroComponent } from './intro/intro.component';

const routes: Routes = [
  { path: '', component: LaunchpadComponent },
  { path: 'intro', component: IntroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunchpadRoutingModule { }
