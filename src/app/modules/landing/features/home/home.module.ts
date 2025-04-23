import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon'
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent, ModalContentComponent } from './home/home.component';
import { VersionComponent } from './version/version.component';
import { PaymentSuccessComponent } from './payment/success.component';
import { PaymentFailComponent } from './payment/fail.component';
import { TeamComponent } from './team/team.component';
import { RoadmapComponent } from './roadmap/roadmap.component';

import { ComponentsModule } from '../../components/components.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { JsonFileService } from '../../service/jsondata/jsondata.service';

import { DirectivesModule } from '../../directives/directives.module';
// import { UserService } from '../../service/user/user.service';
import { HttpService } from '../../../../services/http.service';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    HomeRoutingModule, 
    TranslateModule,
    RouterModule,
    ComponentsModule,
    DirectivesModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [
    JsonFileService, HttpService
  ],
  declarations: [
    HomeComponent,
    ModalContentComponent,
    VersionComponent,
    TeamComponent,
    PaymentSuccessComponent,
    PaymentFailComponent,
    RoadmapComponent
  ]
})
export class HomeModule { }
