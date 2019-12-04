import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartContractComponent } from './pages/smart-contract/smart-contract.component';
import { SmartContractRoutingModule } from './smartcontract-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SmartContractComponent
  ],
  imports: [
    CommonModule,
    SmartContractRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SmartcontractModule { }
