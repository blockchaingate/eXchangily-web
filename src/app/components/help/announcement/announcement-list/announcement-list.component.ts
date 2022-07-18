import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../../../models/announcement';
import { LanService } from 'src/app/services/lan.service';
import { AnnouncementsService } from 'src/app/services/announcements.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent implements OnInit {
  currentLan: string;
  errMsg: string;
  success = true;
  busy = true;
  announceList: Announcement[] = [];
  constructor(
    private lanData: LanService,
    private route: ActivatedRoute,
    private translateServ: TranslateService,
    private _announcementsService: AnnouncementsService,
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      console.log('lang===', params.get('lang'));
      if(params && params.get('lang')) {
        this.currentLan = params.get('lang');
        this.getAnnouncements(this.currentLan);
      } else {
        this.lanData.currentMessage.subscribe(message => {
          // console.log("Yoyo lan changed: ", message);
          if(message) {
            this.currentLan = message;
            this.getAnnouncements(this.currentLan);
          }
    
        });
      }
    });
  }

  getAnnouncements(currentLan: string) {
    this.busy = true;
    this.success = true;
    // console.log("currentLan: ", currentLan);
    if(currentLan === 'zh') currentLan = 'sc';
    this.translateServ.setDefaultLang(currentLan);
    this.translateServ.use(currentLan);
    this._announcementsService.getManyByLan(currentLan).subscribe(ret => {
      // console.log("return: ");
      // console.log(ret);

      if (ret['success']) {
        // console.log("success");

        this.success = true;
        this.announceList = ret['body'] as Announcement[];
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
