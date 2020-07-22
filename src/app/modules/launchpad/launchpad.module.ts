import { NgModule } from '@angular/core';
import { LaunchpadComponent } from './launchpad.component';
import { LaunchpadRoutingModule } from './launchpad-routing.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    LaunchpadRoutingModule,
    TranslateModule
  ],
  providers: [
  ],
  declarations: [
    LaunchpadComponent
  ],
  exports: [
  ]
})
export class LaunchpadModule { }