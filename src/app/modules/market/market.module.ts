import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CarouselModule } from 'ngx-bootstrap';

import { MarketRoutingModule } from './market-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TradeModule } from './components/trade/trade.module';
import { AdvModule } from '../adv/adv.module';

// import { MarketComponent } from './market.component';
import { MarketHomeComponent } from './components/home/market-home.component';
import { MarketListComponent } from './components/list/market-list.component';
import {LiteListComponent} from './components/trade/litelist/lite-list.component';
import { PriceService } from '../../services/price.service';
import { OrderService } from './services/order.service';
import { Web3Service } from '../../services/web3.service';
import { TradeService } from './services/trade.service';
import { KanbanService } from '../../services/kanban.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CarouselModule,
    MarketRoutingModule,
    TradeModule,
    TranslateModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    ModalModule.forRoot(),
    AdvModule
  ],
  providers: [
    PriceService,
    OrderService,
    Web3Service,
    KanbanService,
    TradeService
  ],
  declarations: [
    // MarketComponent,
    MarketHomeComponent,
    MarketListComponent,
    LiteListComponent
  ],
  exports: [
    MarketHomeComponent,
    MarketListComponent,
  ]
})
export class MarketModule { }
