import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { VersionComponent } from './version/version.component';
import { TeamComponent } from './team/team.component';
import { RoadmapComponent } from './roadmap/roadmap.component';

import { ComponentsModule } from '../../components/components.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { JsonFileService } from '../../service/jsondata/jsondata.service';

import { DirectivesModule } from '../../directives/directives.module';
// import { UserService } from '../../service/user/user.service';
import { HttpService } from '../../../../services/http.service';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule, 
    TranslateModule,
    RouterModule,
    ComponentsModule,
    DirectivesModule,
    HttpClientModule
  ],
  providers: [
    JsonFileService, HttpService
  ],
  declarations: [
    HomeComponent,
    VersionComponent,
    TeamComponent,
    RoadmapComponent
  ]
})
export class HomeModule { }
