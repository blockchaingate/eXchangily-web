import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Language } from './models/language';
import { ApiService } from './services/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WsService } from './services/ws.service';
import { CommonModule } from '@angular/common';
import { setTheme } from 'ngx-bootstrap/utils';
import { HeaderComponent } from './components/navigation/header/header.component';
import { FooterComponent } from './components/navigation/footer/footer.component';
import { UtilService } from './services/util.service';
import { TimerService } from './services/timer.service';
import { StorageService } from './services/storage.service';
import { LoginInfoService } from './services/loginInfo.service';
import { LoginQualifyService } from './services/lgoin-quality.service';
import { LanService } from './services/lan.service';
import { KanbanV2Service } from './services/kanban-v2.service';
import { HttpService } from './services/http.service';
import { AnnouncementsService } from './services/announcements.service';
import { AlertService } from './services/alert.service';
import { SubscriptionService } from './services/subscription.service';
import { BrowserModule } from '@angular/platform-browser';
import { Web3Service } from './services/web3.service';
import { KycService } from './services/kyc.service';
import { AirdropService } from './services/airdrop.service';
import { CoinService } from './services/coin.service';
import { CampaignOrderService } from './services/campaignorder.service';
import { BannerService } from './services/banner.service';
import { PriceService } from './services/price.service';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, HeaderComponent, FooterComponent],
  providers: [
    AirdropService,
    AlertService,
    AnnouncementsService,
    ApiService,
    BannerService,
    CampaignOrderService,
    CoinService,
    HttpService,
    LoginInfoService,
    LoginQualifyService,
    LanService,
    KanbanV2Service,
    KycService,
    PriceService,
    StorageService,
    SubscriptionService,
    UtilService,
    WalletService,
    Web3Service,
    WsService,
    TimerService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'exchangily';
  selected = 1;
  noHeader = false;
  flag = 'flag_zh.svg';
  msg = '';
  currentLang = 'en';
  darkBgEnable = false;
  blocked = false;
  private isMobile = false;

  LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sc', name: '简体中文', flag: '🇨🇳' },
    { code: 'tc', name: '繁體中文', flag: 'TW' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'jp', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'kr', name: 'Korean', flag: '🇰🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' }
  ];
  // selectedLanguage = 'en';
  selectedLan = this.LANGUAGES[0].code;

  constructor(private translate: TranslateService, private apiServ: ApiService, private route: ActivatedRoute,
    private wsService: WsService, private storage: StorageService,
    router: Router
  ) {
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang) {
      this.selectedLan = storedLang;
    }
    this.translate.setDefaultLang(this.selectedLan);


    setTheme('bs4'); // Bootstrap 4
    this.darkBgEnable = false;
    this.blocked = false;
    this.isMobile = this.isMobileDevice();
    // const url = window.location.href;
    const hostname = location.hostname;
    if(['exchangily.com', 'www.exchangily.com'].indexOf(hostname) >= 0) {
      this.apiServ.checkCountry().subscribe(
        (countryCode: any) => {
          if(['CA'].indexOf(countryCode) >= 0) {
            this.blocked = true;
          }
        }
      );
    }

    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.url;
        if (
          (url.indexOf('/market') >= 0)
          || (url.indexOf('/launchpad') >= 0)
          || (url.indexOf('/wallet') >= 0) 
          || (url.indexOf('/explorer') >= 0) 
          || (url.indexOf('/smartcontract') >= 0)
        ) {
          this.darkBgEnable = true;
        } else {
          this.darkBgEnable = false;
        }
      }
    });

    /*
    if (url.indexOf('noHeader=true') >= 0) {
      this.noHeader = true;
    }
    */
    /*
    console.log('urllll=', url);
    if (this.route.snapshot.queryParamMap.get('noHeader')) {
      if (this.route.snapshot.queryParamMap.get('noHeader') === 'true') {
        this.noHeader = true;
      } else {
        this.noHeader = false;
      }
      console.log('this.noHeader=', this.noHeader);
    }
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.url;

      }
    });
    */

  }

  ngOnInit() {
    const storedLang = localStorage.getItem('selectedLan');
    if (storedLang) {
      this.selectedLan = storedLang;
      this.translate.use(storedLang);
    } else {
      this.translate.use(this.selectedLan);
    }
  }

  switchLanguage(lang: string) {
    this.selectedLan = (this.LANGUAGES.find((item) => item.code === lang) as Language).code;
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);
    localStorage.setItem("selectedLan", lang);
  }

  private isMobileDevice(): boolean {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      console.log('User is accessing from a mobile browser.');
      this.wsService.connectSocketDapp();

    } else {
      console.log('User is accessing from a laptop or desktop browser.');
    }
    this.storage.setIsMobile(isMobile);
    // console.log('isMobile=' + isMobile);
    return isMobile;
  }

  getisMobile(): boolean {
    return this.isMobile;
  }

}
