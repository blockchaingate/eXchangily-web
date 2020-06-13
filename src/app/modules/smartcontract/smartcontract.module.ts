import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartContractComponent } from './pages/smart-contract/smart-contract.component';
import { SmartContractRoutingModule } from './smartcontract-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { Web3Service } from '../../services/web3.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { AlertService } from '../../services/alert.service';
import {MatTabsModule} from '@angular/material/tabs';

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
    MatTabsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    StorageService, Web3Service, AlertService, ApiService, UtilService, CoinService
  ]
})
export class SmartcontractModule { }
