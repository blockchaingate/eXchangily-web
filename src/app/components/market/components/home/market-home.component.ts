import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { KanbanV2Service } from '../../../../services/kanban-v2.service';
import { BannerService } from '../../../../services/banner.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Banner } from '../../../../models/banner';
import { TranslateModule } from '@ngx-translate/core';
var DefaultBanner = require('../../../../../images/adv/default/default-adv.json');

@Component({
  selector: 'app-market-home',
  standalone: true,
  imports: [CommonModule, CarouselConfig, TranslateModule],
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 5000, noPause: true, showIndicators: true } }
  ]
})
export class MarketHomeComponent implements OnInit {
  banners: any[] = [];
  maintainence = false;
  isMobile = false;

  constructor(private kanbanServ: KanbanV2Service, private bannerServ: BannerService, private _router: Router,
    private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document
  ) {
    //this.getBannerAdv();
  }

  ngOnInit() {
    //if (this.banners.length < 1) {
    this.getBannerAdv();
    //}
    this.maintainence = false;
    this.isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }

    this.kanbanServ.getKanbanStatus().subscribe(
      (res: any) => {
        if (res && res.success) {
          const data = res.body;
          if (data !== 'live') {
            this.maintainence = true;
          }
        }
      },
      err => {
        if (environment.production) {
          this.maintainence = true;
        }
      });
  }

  getBannerAdv() {
    
    /*
    this.bannerServ.getAll().subscribe(
      (res: any) => {
        if(res.ok) {
          this.banners = res['_body'] as Banner[];
          if (!this.banners || this.banners.length < 1) {
            // this.banners = DefaultBanner as Banner[];
            this.getDefaultadv();
          } else {
            this.handleBaner();
          }
        } else {
          this.getDefaultadv();
        }

      },
      err => {
        // this.banners = DefaultBanner as Banner[];
        // this.handleBaner();
        this.getDefaultadv();
      }
    );
    */
    this.getDefaultadv();
  }

  getDefaultadv() {
    /*
    this.bannerServ.getDefault().subscribe(
      res => {
        this.banners = res as Banner[];
        this.handleBaner();
      }
    )
    */
   this.banners = DefaultBanner;
   this.handleBaner();
  }

  handleBaner() {
    let currentLan = localStorage.getItem('Lan');
    if (currentLan === 'zh' || currentLan === 'cn') {
      currentLan = 'sc';
    }

    console.log('this.banners===', this.banners);
    if(this.banners && (this.banners.length > 0)) {
      this.banners.forEach(banner => {
        const titleItem = banner.title.filter((t: any) => t.lan === currentLan) || banner.title.filter((t: any) => t.lan === 'en');
        if (titleItem) {
          banner.titleLan = titleItem[0].text;
        }
  
        const subtitleItem = banner.subtitle.filter((t: any) => t.lan === currentLan) || banner.subtitle.filter((t: any) => t.lan === 'en');
        if (subtitleItem) {
          banner.subtitleLan = subtitleItem[0].text;
        }
  
        const descItem = banner.desc.filter((t: any) => t.lan === currentLan) || banner.desc.filter((t: any) => t.lan === 'en');
        if (descItem) {
          banner.descLan = descItem[0].text;
        }
      });
    }

  }

  onClick(url: string) {
    if (!url || url.length < 1) { return; }
    this._router.navigate([url]);
  }

}
