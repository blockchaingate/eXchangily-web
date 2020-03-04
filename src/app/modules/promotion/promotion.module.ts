import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { IndexComponent } from './components/index/index.component';
import { MainComponent } from './components/main/main.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [IndexComponent, MainComponent],
  imports: [
    CommonModule,
    MatCardModule,
    PromotionRoutingModule
  ]
})
export class PromotionModule { }
