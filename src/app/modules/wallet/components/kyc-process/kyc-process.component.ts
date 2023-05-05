import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-kyc-process',
  templateUrl: './kyc-process.component.html',
  styleUrls: ['./kyc-process.component.css']
})
export class KycProcessComponent implements OnInit {
  url: string;
  urlSafe: SafeResourceUrl;
  constructor(private storageService: StorageService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log('go kyc process');
    this.storageService.getItem('otc_token').subscribe((token: any) => {
      console.log('token=', token);
      this.storageService.getItem('next_url').subscribe((next_url: any) => {
        this.url = environment.endpoints.otc_website + 'setup/' + next_url + '/token/' + token;
        console.log('this.url=', this.url);
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      });
    })
  }

}
