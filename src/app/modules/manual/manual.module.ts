import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualRoutingModule } from './manual-routing.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ManualComponent } from './manual.component';
import { ScComponent } from './sc/sc.component';
@NgModule({
  declarations: [
    ManualComponent,
    ScComponent,
  ],
  imports: [
    CommonModule,
    ManualRoutingModule,
    MatCardModule
  ]
})
export class ManualModule { }
