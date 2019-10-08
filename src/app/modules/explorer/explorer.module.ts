import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerComponent } from './explorer.component';
import { BlocksComponent } from './pages/blocks/blocks.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { TransactionDetailComponent } from './pages/transaction-detail/transaction-detail.component';
import { BlockDetailComponent } from './pages/block-detail/block-detail.component';
import { AddressDetailComponent } from './pages/address-detail/address-detail.component';
import { KanbanService } from '../../services/kanban.service';
import { UtilService } from '../../services/util.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

const routes: Routes = [
  { path: '', component: ExplorerComponent },
  { path: 'blocks', component: BlocksComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transaction/:id', component: TransactionDetailComponent },
  { path: 'block/:id', component: BlockDetailComponent },
  { path: 'address/:id', component: AddressDetailComponent },
];

@NgModule({
  declarations: [
    BlocksComponent,
    TransactionsComponent, 
    TransactionDetailComponent,
    BlockDetailComponent,
    AddressDetailComponent,
    ExplorerComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    KanbanService, UtilService
  ]
})

export class ExplorerModule { } 
