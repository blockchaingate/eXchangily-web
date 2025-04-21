import { Component, OnInit, TemplateRef } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { StarService } from '../../../service/star/star.service';
import { ActivatedRoute, Params } from '@angular/router';
import { UtilService } from '../../../../../services/util.service';

@Component({
  selector: 'app-star-event',
  templateUrl: './star-event.component.html',
  styleUrls: ['./star-event.component.scss']
})
export class StarEventComponent implements OnInit {
  token = '';
  event: any;
  id = '';

  constructor(
    private starServ: StarService,
    private route: ActivatedRoute,
    private utilServ: UtilService,
    private _storageServ: StorageService
  ) { }

  ngOnInit() {
    this._storageServ.getToken().subscribe(
      (token: any) => {
        this.token = token;

        this.route.params.subscribe((params: Params) => {
          this.id = params['id'];
          console.log('this.id=', this.id);
          if (this.id) {
            this.starServ.getEvent(this.id, token).subscribe(
              (res: any) => {
                this.event = res;
              },
              (error: any) => {
              }
            );

          }
        });
      });
  }

  showAmount(amount: number) {
    return Number(this.utilServ.showAmount(amount, 18));
  }
}
