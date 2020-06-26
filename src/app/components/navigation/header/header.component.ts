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
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLang: string;
  loggedIn = false;
  // @Output() public sidenavToggle = new EventEmitter();
  background: string;
  pendingtransactions: TransactionItem[];
  closetransactions: TransactionItem[];
  color = 'primary';
  mode = 'determinate';
  value = 100;
  testMode: boolean;
  interval;

  constructor(private translate: TranslateService, private router: Router, private alertServ: AlertService,
    public utilServ: UtilService, private kanbanServ: KanbanService, private timerServ: TimerService,
    private location: Location, private storageServ: StorageService, private apiServ: ApiService, private _userAuth: UserAuth) { }
  
  ngOnInit() {
    this.testMode = true;
    if (environment.production) {
      this.testMode = false;
    }
    this.pendingtransactions = [];
    this.closetransactions = [];

    this._userAuth.isLoggedIn$
    .subscribe((value: string) => {
      console.log('value: ' + value);
      this.loggedIn = value ? true : false;
      // alert(this.loggedIn);
    });

    this.timerServ.transactionStatus.subscribe(
      (txItem: any) => {
        if (txItem && txItem.txid) {
          if (txItem.status === 'pending') {
            this.pendingtransactions.push(txItem);
          } else {
            for (let i = 0; i < this.pendingtransactions.length; i++) {
              const item = this.pendingtransactions[i];
              if (item.txid === txItem.txid) {
                item.status = txItem.status;
                this.storageServ.updateTransactionHistoryList(item);
                this.pendingtransactions.splice(i, 1);
                this.closetransactions.unshift(item);
                break;
              }
            }
          }
        }
      } 
    );

    this.storageServ.getTransactionHistoryList().subscribe(
      (transactionHistory: TransactionItem[]) => {
        if ( transactionHistory ) {
          let hasPending = false;
          const subArray = transactionHistory.reverse().slice( 0, 5 );
          for (let i = 0; i < subArray.length; i++) {
            const item = subArray[i];
            // console.log('item.status=', item.status);
            if (item.status === 'pending') {
              this.pendingtransactions.push(item);
              this.timerServ.checkTransactionStatus(item, 60); 

              hasPending = true;
            } else {
              this.closetransactions.push(item);
            }
          }

        }
        
    });

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
    } else if (lang === 'en') {
      this.currentLang = 'English';
    }
    this.translate.use(lang.toLowerCase());
  }

  selectLan(lan: string) {
    window.localStorage.setItem('Lan', lan);
    this.translate.use(lan);
    if (lan === 'en') {
      this.currentLang = 'English';
    } else 
    if (lan === 'zh') {
      this.currentLang = '中文';
    }
  }

  logout() {
    this._userAuth.id = '';
    this._userAuth.email = '';
    this._userAuth.token = '';
    this._userAuth.logout();
    this.router.navigate(['/']);
  }

}
