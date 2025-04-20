import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from './transaction-history.component';
import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { CreateOrdersComponent } from './create-orders/create-orders.component';
import { TradesComponent } from './trades/trades.component';
import { CancelOrdersComponent } from './cancel-orders/cancel-orders.component'; 
import { ApiService } from 'src/app/services/api.service';
@NgModule({
  declarations: [
    TransactionHistoryComponent,
    CreateOrdersComponent,
    TradesComponent,
    CancelOrdersComponent
  ],
  imports: [
    CommonModule,
    TransactionHistoryRoutingModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    TranslateModule
  ],
  providers: [
    ApiService
  ]
})
export class TransactionHistoryModule { }
