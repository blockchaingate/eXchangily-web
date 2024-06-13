import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from './transaction-history.component';
import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
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
    MatTableModule
  ],
  providers: [
    ApiService
  ]
})
export class TransactionHistoryModule { }
