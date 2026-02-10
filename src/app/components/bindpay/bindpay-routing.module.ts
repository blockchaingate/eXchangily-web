import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BindpayComponent } from './bindpay.component';

const routes: Routes = [
    { path: '', component: BindpayComponent }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BindpayRoutingModule { }