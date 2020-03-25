import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-campaigns',
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
  })
  export class CampaignsComponent implements OnInit {
    campaigns: any;
    ngOnInit() {
    }
  }