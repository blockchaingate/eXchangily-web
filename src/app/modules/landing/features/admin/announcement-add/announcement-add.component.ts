import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../../../../models/announcement';
import { StorageService } from 'src/app/services/storage.service';
import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { AnnouncementsService } from 'src/app/services/announcements.service';

@Component({
  selector: 'app-announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.css']
})
export class AnnouncementAddComponent implements OnInit {


  title: string;
  summary: string;
  desc: string;
  token: string;

  success = false;
  ticketId: string;
  toShort = false;
  catselected = true;
  lanselected = true;
  logIn = true;
  errMsg: string;
  selectedLan: string;
  selectedCat: string;
  catValues = ['Technical Updates', 'News', 'Events', 'Partnerships'];

  constructor(private _AnnouncementServ: AnnouncementsService, private storageService: StorageService, private _userAuth: UserAuth) { }

  ngOnInit() {
    /* this._ticketServ.getTicketCats().subscribe(ret => {
        this.ticketCats = <[TicketCat]>ret; alert(JSON.stringify(this.ticketCats)); 
    });
    */
  }

  selectCat(catId) {
    this.selectCat = catId;
  }

  selectLan(lanId) {
    this.selectLan = lanId;
  }

  submit() {

    this._userAuth.isLoggedIn$.subscribe((value: string) => {
      // console.log('value: ' + value);
      this.logIn = value ? true : false;
      // alert(this.loggedIn);

      console.log('selectedCat: ' + this.selectedCat);
      console.log('selectedLan: ' + this.selectedLan);
      console.log('title: ' + this.title);
      console.log('summary: ' + this.summary);
      console.log('desc: ' + this.desc);


      // announcement object will post
      const announce: Announcement = {
        'title': this.title,
        'category': this.selectedCat,
        'language': this.selectedLan,
        'content': this.desc,
        'contentSummary': this.title,
        'createdBy': '58dc560d6ed93640a1e56cb7',
        'headline': true
      };

      if (this.selectedCat == null || this.selectedCat === '') {
        this.catselected = false;
        return;
      }

      if (this.selectedLan == null || this.selectedLan === '') {
        this.lanselected = false;
        return;
      }

      this.catselected = true;
      this.lanselected = true;

      if (!this.title || this.title.length < 10 || !this.summary || this.summary.length < 20 || !this.desc || this.desc.length < 20) {
        this.toShort = true;
        return;
      }
      this.toShort = false;

      this.storageService.getToken().subscribe(
        (token: any) => {
          this.token = token;
          console.log('token==', token);
          if (!token) {
            this.logIn = false;
            this.success = false;
          } else {
            this._AnnouncementServ.create(announce, token).subscribe(ret => {
              console.log('Return: ');
              console.log(ret['body']);


              this.success = true;
              this.logIn = true;
              this.ticketId = ret['_id'];
            },
              err => {
                this.errMsg = JSON.stringify(err);
                this.logIn = true;
                this.success = false;
              });
          }
        });
    });
  }

}
