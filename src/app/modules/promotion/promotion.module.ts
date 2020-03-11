import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { IndexComponent } from './components/index/index.component';
import { MainComponent } from './components/main/main.component';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [IndexComponent, MainComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    PromotionRoutingModule
  ]
})
export class PromotionModule { }
