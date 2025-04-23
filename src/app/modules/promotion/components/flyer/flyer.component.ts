import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { CampaignOrderService } from 'src/app/services/campaignorder.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flyer',
  templateUrl: './flyer.component.html',
  styleUrls: ['./flyer.component.css']
})
export class FlyerComponent implements OnInit {
  referralCode: string;
  baseUrl: string;
  promotionLink: string;
  link: string;

  constructor(private storageService: StorageService, private campaignorderServ: CampaignOrderService) {
  }

  async ngOnInit() {
    this.baseUrl = environment.baseUrl;
    this.storageService.getToken().subscribe(
      (token: any) => {

        this.campaignorderServ.getProfile(token).subscribe(
          (res2: any) => {
            if (res2 && res2.ok) {
              console.log('res2=', res2);
              this.referralCode = res2._body.referralCode;
              this.promotionLink = this.baseUrl + '/login/signup/' + this.referralCode;
            }
          });
      });
  }

  copyMessage(){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.promotionLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  dlDataUrlBin() {
    const obj: any = document.getElementById('promotionLink_qr_code');
    if(obj) {
      const y = obj.getElementsByTagName('canvas')[0];
      // console.log('y.src=' + y.src);
      if (y) {
        const link = y.toDataURL('image/png');
        this.link = link;
      }
    }


  }
}
