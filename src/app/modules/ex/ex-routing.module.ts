import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeComponent } from './components/code/code.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: ':code', component: CodeComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExRoutingModule { }