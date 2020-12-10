import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClubService } from './services/club.service';
import { ClubRoutingModule } from './club-routing.module';

import { ClubHomeComponent } from './components/home/club-home.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ClubRoutingModule
    ],
    providers: [
        ClubService
    ],
    declarations: [
        ClubHomeComponent
    ],
    exports: [
        ClubHomeComponent
    ]
})
export class ClubModule { }
