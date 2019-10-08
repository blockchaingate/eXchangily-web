import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { VersionComponent } from './version/version.component';
const routes: Routes = [
  {
    path: '',
    component:   HomeComponent,
  }, {
    path: 'version',
    component:   VersionComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
