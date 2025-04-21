import { Component, OnInit, TemplateRef } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { StarService } from '../../../service/star/star.service';

@Component({
  selector: 'app-star-events',
  templateUrl: './star-events.component.html',
  styleUrls: ['./star-events.component.scss']
})
export class StarEventsComponent implements OnInit {
  token = '';
  events: any;

  constructor(
    private starServ: StarService,
    private _storageServ: StorageService
  ) { }

  ngOnInit() {
    this._storageServ.getToken().subscribe(
      (token: any) => {
        this.token = token;
        this.starServ.getAllEvents(token).subscribe(
          (res: any) => {
            this.events = res;
          },
          (error: any) => {
            this.events = [];
          }
        );
      }
    );
  }
}
