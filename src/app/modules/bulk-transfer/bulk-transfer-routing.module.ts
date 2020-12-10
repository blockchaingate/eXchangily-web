import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkTransferComponent } from './bulk-transfer.component';

const routes: Routes = [
  { path: '', component: BulkTransferComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkTransferRoutingModule { }
