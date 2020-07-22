import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VersionComponent } from './version/version.component';
const routes: Routes = [
  {
    path: 'version',
    component:   VersionComponent,
  },
  {
    path: '',
    component:   HomeComponent,
  } 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
