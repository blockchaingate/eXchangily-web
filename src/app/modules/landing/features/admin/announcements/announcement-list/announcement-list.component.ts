import { Component, OnInit } from '@angular/core';
import { LanService } from 'src/app/services/lan.service';
import { AnnouncementsService } from 'src/app/services/announcements.service';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent implements OnInit {
  currentLan: String;
  errMsg: string;
  success = true;
  busy = true;
  announceList = [];
  constructor(
    private lanData: LanService,
    private _announcementsService: AnnouncementsService,
  ) { }

  ngOnInit(): void {
    this.lanData.currentMessage.subscribe(message => {
      // console.log("Yoyo lan changed: ", message);

      this.currentLan = message;
      this.getAnnouncements(this.currentLan);
    });
  }

  getAnnouncements(currentLan: String) {
    this.busy = true;
    this.success = true;
    // console.log("currentLan: ", currentLan);

    this._announcementsService.getManyByLan(currentLan === 'en' ? 'en' : 'cn').subscribe(ret => {
      // console.log("return: ");
      // console.log(ret);


      if (ret['success']) {
        // console.log("success");

        this.success = true;
        this.announceList = ret['body'];
      } else {
        // console.log("fail");

        this.errMsg = 'Server busy';
        this.success = false;

      }
      this.busy = false;
    },
      err => {
        // console.log("error: ", JSON.stringify(err));

        this.errMsg = JSON.stringify(err);
        this.success = false;
        this.busy = false;
      });
  }

}
