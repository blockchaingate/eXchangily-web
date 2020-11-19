import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';

@NgModule({
  declarations: [
    AnnouncementComponent,
    AnnouncementListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AnnouncementModule { }
