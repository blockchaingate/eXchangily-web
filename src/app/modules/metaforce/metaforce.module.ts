import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaforceComponent } from './metaforce.component';
import { SmartContractRoutingModule } from './metaforce-routing.module';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { Web3Service } from '../../services/web3.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { AlertService } from '../../services/alert.service';

@NgModule({
  declarations: [MetaforceComponent],
  imports: [
    CommonModule,
    SmartContractRoutingModule,
    MatSelectModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    SharedModule
  ],
  providers: [
    StorageService, ApiService, Web3Service, UtilService, CoinService, AlertService
  ]
})
export class MetaforceModule { }
