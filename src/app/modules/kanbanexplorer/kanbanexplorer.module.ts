import { NgModule } from '@angular/core';

import { KanbanexplorerRoutingModule } from './kanbanexplorer-routing.module';
import { KanbanexplorerComponent } from './kanbanexplorer.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { OrdeDetailComponent } from './components/order-detail/order-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { BlockDetailsComponent } from './components/block-details/block-details.component';
import { TxDetailsComponent } from './components/tx-details/tx-details.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AddressDetailsComponent } from './components/address-details/address-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
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
    OrdeDetailComponent,
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
