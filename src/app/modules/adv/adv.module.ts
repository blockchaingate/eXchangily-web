import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { AdvblockComponent } from './components/advblock/advblock.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CarouselModule,
        TranslateModule
    ],
    providers: [
    ],
    declarations: [
        AdvblockComponent,
    ],
    exports: [
        AdvblockComponent,
    ]
})
export class AdvModule { }
