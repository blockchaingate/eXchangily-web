import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpringComponent } from './spring/spring.component';
import { BulkTransferComponent } from './bulk-transfer.component';

const routes: Routes = [
  { path: '', component: BulkTransferComponent },
  { path: 'spring', component: SpringComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkTransferRoutingModule { }
