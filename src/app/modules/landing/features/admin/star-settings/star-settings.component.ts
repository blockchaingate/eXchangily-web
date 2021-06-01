import { Component, OnInit } from '@angular/core';
import { StarService } from '../../../service/star/star.service';

@Component({
    selector: 'app-star-settings',
    templateUrl: './star-settings.component.html',
    styleUrls: ['./star-settings.component.scss']
  })
  export class StarSettingsComponent implements OnInit {
      settings: any;
      constructor(
        private starServ: StarService) {}      
      ngOnInit() {
        this.starServ.getSettings().subscribe(
            (ret: any) => {
                this.settings = ret;
            }
        );
      }
  }