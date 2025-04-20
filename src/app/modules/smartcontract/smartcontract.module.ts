import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartContractComponent } from './pages/smart-contract/smart-contract.component';
import { SmartContractRoutingModule } from './smartcontract-routing.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { Web3Service } from '../../services/web3.service';
import { UtilService } from '../../services/util.service';
import { CoinService } from '../../services/coin.service';
import { AlertService } from '../../services/alert.service';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SmartContractComponent
  ],
  imports: [
    CommonModule,
    SmartContractRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ],
  providers: [
    StorageService, Web3Service, AlertService, ApiService, UtilService, CoinService
  ]
})
export class SmartcontractModule { }
