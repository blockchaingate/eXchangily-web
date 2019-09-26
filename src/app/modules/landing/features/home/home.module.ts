import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

import { TeamComponent } from './team/team.component';
import { RoadmapComponent } from './roadmap/roadmap.component';

import { ComponentsModule } from '../../components/components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { JsonFileService } from '../../service/jsondata/jsondata.service';

import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FlexLayoutModule,
    TranslateModule,
    RouterModule,
    ComponentsModule,
    DirectivesModule
  ],
  providers: [
    JsonFileService
  ],
  declarations: [
    HomeComponent,
    TeamComponent,
    RoadmapComponent
  ]
})
export class HomeModule { }
