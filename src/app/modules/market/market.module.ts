import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarketRoutingModule } from './market-routing.module';
import { TradeModule } from './components/trade/trade.module';
import { AdvModule } from '../adv/adv.module';
import { AlertService } from '../../services/alert.service';
import { MarketHomeComponent } from './components/home/market-home.component';
import { MarketListComponent } from './components/list/market-list.component';
import { PriceService } from '../../services/price.service';
import { Web3Service } from '../../services/web3.service';
import { TradeService } from './services/trade.service';
import { KanbanService } from '../../services/kanban.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarketTopComponent } from './components/top/market-top.component';
import { MarketTopBlockComponent } from './components/top-block/market-top-block.component';
import { TradeAutoComponent } from './components/trade-auto/trade-auto.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CarouselModule,
    MarketRoutingModule,
    TradeModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    SharedModule,
    ModalModule.forRoot(),
    AdvModule
  ],
  providers: [
    PriceService,
    Web3Service,
    KanbanService,
    TradeService,
    AlertService
  ],
  declarations: [
    MarketHomeComponent,
    MarketListComponent,
    MarketTopComponent,
    TradeAutoComponent,
    MarketTopBlockComponent
  ],
  exports: [
    MarketHomeComponent,
    MarketListComponent,
  ]
})
export class MarketModule { }
