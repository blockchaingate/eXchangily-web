import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { KanbanexplorerRoutingModule } from './kanbanexplorer-routing.module';
import { KanbanexplorerComponent } from './kanbanexplorer.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { HttpClientModule } from '@angular/common/http';
import { BlockDetailsComponent } from './components/block-details/block-details.component';
import { TxDetailsComponent } from './components/tx-details/tx-details.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AddressDetailsComponent } from './components/address-details/address-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KanbanStatsComponent } from './components/kanban-stats/kanban-stats.component';
import { LatestOrdersComponent } from './components/latest-orders/latest-orders.component';
import { LatestTradesComponent } from './components/latest-trades/latest-trades.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    KanbanexplorerComponent,
    BlocksComponent,
    BlockDetailsComponent,
    TxDetailsComponent,
    SearchBoxComponent,
    AddressDetailsComponent,
    DashboardComponent,
    KanbanStatsComponent,
    LatestOrdersComponent,
    LatestTradesComponent
  ],
  imports: [
    MatSlideToggleModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    KanbanexplorerRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: []
})
export class KanbanExplorerModule { }
