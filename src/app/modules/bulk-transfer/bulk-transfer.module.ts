import { NgModule } from '@angular/core';
import { BulkTransferComponent } from './bulk-transfer.component';
import { PreviewComponent } from './preview/preview.component';
import { SpringComponent } from './spring/spring.component';
import { BulkTransferRoutingModule } from './bulk-transfer-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BulkTransferRoutingModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: [
  ],
  declarations: [
    BulkTransferComponent,
    PreviewComponent,
    SpringComponent
  ],
  exports: [
  ]
})
export class BulkTransferModule { }