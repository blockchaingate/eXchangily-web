import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../../../models/announcement';

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