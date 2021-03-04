import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { CoinsComponent } from './coins.component';
import { CoininfoComponent } from './coin-info.component';
import { CoinRoutingModule } from './coin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        CoinRoutingModule
    ],
    providers: [
        ApiService
    ],
    declarations: [
        CoinsComponent,
        CoininfoComponent
    ],
    exports: [
        CoinsComponent,
        // CoininfoComponent
    ]
})
export class CoinModule { }
