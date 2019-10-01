import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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
import { UserAuth } from '../../service/user-auth/user-auth.service';
import { UserService } from '../../service/user/user.service';
import { HttpService } from '../../../../services/http.service';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FlexLayoutModule,
    TranslateModule,
    RouterModule,
    ComponentsModule,
    DirectivesModule,
    HttpClientModule
  ],
  providers: [
    JsonFileService, UserAuth, UserService, HttpService
  ],
  declarations: [
    HomeComponent,
    TeamComponent,
    RoadmapComponent
  ]
})
export class HomeModule { }
