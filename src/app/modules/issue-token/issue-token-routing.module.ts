import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssueTokenComponent } from './issue-token.component';
import { IssueTokenFrc20Component } from './frc20/frc20.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
    { path: '', component: IssueTokenComponent },
    { path: 'frc20', component: IssueTokenFrc20Component },
    { path: 'update', component: UpdateComponent }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IssueTokenRoutingModule { }