import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { VersionModel } from '../../models/version';

@Component({
  selector: 'app-donwload',
  templateUrl: './donwload.component.html',
  styleUrls: ['./donwload.component.scss']
})
export class DonwloadComponent implements OnInit {
  breakpoint: any;
  clickCount = 0;

  items: VersionModel[] = [];
   lastestApk!: VersionModel;
   testApk!: VersionModel;

  constructor(
      private http: HttpClient
      // private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    this.getFiles().subscribe((data: any) => {

      this.lastestApk = data.find((obj: { versionName: string; }) => obj.versionName === "Realize");
      this.testApk = data.find((obj: { versionName: string; }) => obj.versionName === "Candidate");
      // this.items = data.filter((obj: { versionName: string; }) => obj.versionName != "Realize" && obj.versionName != "Candidate");
    });

  }

  getFiles() {
    return this.http.get('https://exchangily.com/download/version.json');
    // return this.http.get('/assets/version.json');
   }

   openTest(){
    this.clickCount ++;
  }


}




