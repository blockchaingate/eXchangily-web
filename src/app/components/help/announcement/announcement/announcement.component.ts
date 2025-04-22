import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../../../models/announcement';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AnnouncementListComponent } from '../announcement-list/announcement-list.component';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, TranslateModule, AnnouncementListComponent],
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}