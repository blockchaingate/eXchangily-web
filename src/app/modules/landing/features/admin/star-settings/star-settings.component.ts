import { Component, OnInit } from '@angular/core';
import { StarService } from '../../../service/star/star.service';
import { StorageService } from '../../../../../services/storage.service';

@Component({
    selector: 'app-star-settings',
    templateUrl: './star-settings.component.html',
    styleUrls: ['./star-settings.component.scss']
  })
  export class StarSettingsComponent implements OnInit {
      settings: any;
      token: string;
      constructor(
        private _storageServ: StorageService,
        private starServ: StarService) {}      
      ngOnInit() {
        this._storageServ.getToken().subscribe(
          (token: string) => {
            this.token = token;        
            this.starServ.getSettings(this.token).subscribe(
                (ret: any) => {
                    this.settings = ret;
                }
            );
          });
      }
  }