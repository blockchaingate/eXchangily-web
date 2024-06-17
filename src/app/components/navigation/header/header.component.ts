import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransactionItem } from '../../../models/transaction-item';
import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';
import { UtilService } from '../../../services/util.service';
import { UserAuth } from '../../../modules/landing/service/user-auth/user-auth.service';
import { KanbanService } from '../../../services/kanban.service';
import { TimerService } from '../../../services/timer.service';
import { environment } from '../../../../environments/environment';
import { LanService } from 'src/app/services/lan.service';
import { LoginInfoModel } from 'src/app/models/lgoin-info';
import { LoginInfoService } from 'src/app/services/loginInfo.service';
import { LoginQualifyService } from 'src/app/services/lgoin-quality.service';
import { Announcement } from '../../../models/announcement';
import { AnnouncementsService } from 'src/app/services/announcements.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isProduction: boolean;
  currentLang: string;
  loggedIn = false;
  selectedItem = 1;
  // @Output() public sidenavToggle = new EventEmitter();
  background: string;
  pendingtransactions: TransactionItem[];
  closetransactions: TransactionItem[];
  color = 'primary';
  mode = 'determinate';
  value = 100;
  showCollapse: boolean;
  testMode: boolean;
  displayHideLabel: boolean;
  readyGo: boolean;
  interval;
  message: string;
  LoginInfo: boolean;
  LoginQualify: boolean;
  urgentAnnouncementsList: Announcement[] = [];

  constructor(
    private translate: TranslateService, private router: Router,
    private alertServ: AlertService,
    public utilServ: UtilService,
    private kanbanServ: KanbanService, private timerServ: TimerService,
    private location: Location,
    private storageServ: StorageService,
    private apiServ: ApiService,
    private _userAuth: UserAuth,
    private lanData: LanService,
    private LoginInfodata: LoginInfoService,
    private LoginQualifydata: LoginQualifyService,
    private announceServ: AnnouncementsService
  ) { }

  ngOnInit() {
    this.isProduction = environment.production;
    this.LoginInfodata.currentMessage.subscribe(isLogin => this.LoginInfo = isLogin);
    this.LoginQualifydata.currentMessage.subscribe(isQualify => this.LoginQualify = isQualify);
    // console.log("init:");

    // console.log("init LoginInfodata: " + this.LoginInfo);
    // console.log("init LoginQualifydata: " + this.LoginQualify);

    this.lanData.currentMessage.subscribe(
      message => {
        this.message = message;
        this.getUrgentAnnouncements(message);
      });
    // console.log("current lang: " + this.message);

    this.testMode = true;
    this.displayHideLabel = true;
    if (environment.production) {
      this.testMode = false;
    }
    this.showCollapse = false;
    this.pendingtransactions = [];
    this.closetransactions = [];

    this._userAuth.isLoggedIn$
      .subscribe((value: string) => {
        // console.log('value: ' + value);
        this.loggedIn = value ? true : false;
        // alert(this.loggedIn);
      });

    // check user login token.
    this.readyGo = true;
    this.storageServ.getToken().subscribe(
      (token: string) => {
        if (!token) {
          this.readyGo = false;
        } else {
          this.LoginInfodata.changeMessage(true);
          // check if user qualify for compaign
          this.storageServ.getCampaignQualify().subscribe(
            (Qualify: boolean) => {
              // console.log('Qualify=', Qualify);
              // set event menu items status.
              this.LoginQualifydata.changeMessage(Qualify);

              // test output
              // console.log("this.readyGo,isQualify: " + this.readyGo + Qualify);
              // console.log("LoginInfodata.currentMessage: " + this.LoginInfo);
              // console.log("LoginQualifydata: " + this.LoginQualify);
            }
          );
        }
      })

    this.timerServ.transactionStatus.subscribe(
      (txItem: any) => {
        if (txItem && txItem.txid) {
          if (txItem.status === 'pending') {
            this.pendingtransactions.push(txItem);
          } else {
            for (let i = 0; i < this.pendingtransactions.length; i++) {
              const item = this.pendingtransactions[i];
              if (item.transactionId === txItem.txid) {
                item.status = txItem.status;
                this.pendingtransactions.splice(i, 1);
                this.closetransactions.unshift(item);
                break;
              }
            }
          }
        }
      }
    );


    this.currentLang = 'English';
    this.translate.setDefaultLang('en');
    this.setLan();


    this.background = 'dark-back';
    const path = this.location.path();
    if (path.indexOf('/home') >= 0 || path.indexOf('/login') >= 0) {
      // this.background = 'gradient-back-title';
    }
  }

  linkTo(url: string) {
    this.showCollapse = false;
    if(url == '/manual') {
      if(this.currentLang != 'English') {
        url = '/manual/sc'
      }
    }
    this.router.navigate([url]);

  }

  goToUrl(url: string): void {
    window.location.href = url;
  }

  setLan() {
    let lang = window.localStorage.getItem('Lan');

    if (!lang) {
      lang = navigator.language;
      lang = lang.substr(0, 2);
      if (lang === 'CN' || lang === 'cn') {
        lang = 'zh';
      }
      localStorage.setItem('Lan', lang.toLowerCase());
    } else {
      if (lang === 'CN' || lang === 'cn') {
        lang = 'zh';
      }
    }

    if (lang === 'zh') {
      this.currentLang = '中文';
      this._userAuth.language = '简体中文';
      this.lanData.changeMessage('zh');


    } else if (lang === 'en') {
      this.currentLang = 'English';
      this._userAuth.language = 'English';
      this.lanData.changeMessage('en');
    }
    this.translate.use(lang.toLowerCase());
  }

  selectLan(lan: string) {
    this.showCollapse = false;
    window.localStorage.setItem('Lan', lan);
    this.translate.use(lan);
    if (lan === 'en') {
      this.currentLang = 'English';
      this.lanData.changeMessage('en');
      console.log('switch lang: ' + this.message);
    } else
      if (lan === 'zh') {
        this.currentLang = '中文';
        this.lanData.changeMessage('zh');
        console.log('switch lang: ' + this.message);
      }
  }

  // logout() {
  //   this._userAuth.id = '';
  //   this._userAuth.email = '';
  //   this._userAuth.token = '';
  //   this._userAuth.logout();
  //   this.router.navigate(['/']);
  // }

  logout() {
    // console.log("Going to logout");
    // console.log("token: " + this.storageService.getToken());


    this._userAuth.id = '';
    this._userAuth.email = '';
    this._userAuth.token = '';
    this._userAuth.logout();
    this.storageServ.removeToken();
    this.storageServ.removeCampaignQualify();
    this.LoginInfodata.changeMessage(false);
    this.LoginQualifydata.changeMessage(false);
    // console.log("LoginInfodata: " + this.LoginInfo.toString());
    // console.log("LoginQualifydata: " + this.LoginQualify.toString());
    // console.log("token: " + this.storageService.getToken());

    this.router.navigate(['/']);
  }

  hideTestLabel() {
    console.log('hideTestLabel working!!');
    this.displayHideLabel = false;
  }

  getUrgentAnnouncements(currentLan: string) {
    if (currentLan === 'zh') currentLan = 'sc';
    const query = { lanCode: currentLan, active: true, urgent: true };
    this.announceServ.find(query).subscribe(ret => {
      if (ret['success']) {
        this.urgentAnnouncementsList = ret['body'] as Announcement[];
        alert(this.urgentAnnouncementsList[0].title)
      } else {
      }
    },
      err => {
      });
  }

}
