import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VersionComponent } from './version/version.component';
import { PaymentSuccessComponent } from './payment/success.component';
import { PaymentFailComponent } from './payment/fail.component';
import { TeamComponent } from './team/team.component';
const routes: Routes = [
  {
    path: 'team',
    component:   TeamComponent,
  },
  {
    path: 'version',
    component:   VersionComponent,
  },
  {
    path: 'paymentsuccess',
    component:   PaymentSuccessComponent,
  },
  {
    path: 'paymentfail',
    component:   PaymentFailComponent,
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
