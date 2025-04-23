import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../../../models/announcement';
import { LanService } from 'src/app/services/lan.service';
import { AnnouncementsService } from 'src/app/services/announcements.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}