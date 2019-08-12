import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { ExplorerComponent } from './explorer.component';
import { ExplorerDashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: ExplorerComponent}
];

@NgModule({
  declarations: [
    ExplorerDashboardComponent,
    ExplorerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})

export class ExplorerModule { }
