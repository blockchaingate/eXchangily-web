import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransactionItem } from '../../../models/transaction-item';
import { StorageService } from '../../../services/storage.service'; 
import { ApiService } from '../../../services/api.service'; 
import { AlertService } from '../../../services/alert.service';
import { UtilService } from '../../../services/util.service';
import { KanbanService } from '../../../services/kanban.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLang: string;
  // @Output() public sidenavToggle = new EventEmitter();
  background: string;
  pendingtransactions: TransactionItem[];
  closetransactions: TransactionItem[];
  color = 'primary';
  mode = 'determinate';
  value = 100;  

  play: boolean;
  interval;

  constructor(private translate: TranslateService, private router: Router, private alertServ: AlertService,
    private utilServ: UtilService, private kanbanServ: KanbanService,
    private location: Location, private storageServ: StorageService, private apiServ: ApiService) { }
 
  ngOnInit() {
    this.pendingtransactions = [];
    this.closetransactions = [];

    this.storageServ.getTransactionHistoryList().subscribe(
      (transactionHistory: TransactionItem[]) => {
        if ( transactionHistory ) {
          let hasPending = false;
          const subArray = transactionHistory.reverse().slice( 0, 5 );
          for (let i = 0; i < subArray.length; i++) {
            const item = subArray[i];
            if (item.status === 'pending') {
              this.pendingtransactions.push(item);
              hasPending = true;
            } else {
              this.closetransactions.push(item);
            }
          }
          if (hasPending && !this.play) {
            this.startTimer();
          }
        }
        
    });
    this.storageServ.newTransaction.subscribe(
      (transaction: TransactionItem) => {
        this.pendingtransactions.push(transaction);
        if (!this.play) {
          this.startTimer();
        }
      }
    );
    //this.tradeServ.new
    this.currentLang = 'English';
    this.translate.setDefaultLang('en');
    this.setLan();   
    this.background = 'dark-back';
    const path = this.location.path();
    if (path.indexOf('/home') >= 0 || path.indexOf('/login') >= 0) {
      // this.background = 'gradient-back-title';
    }
  }

  ngOnDestroy() {
    this.pauseTimer();
  }

  startTimer() {
    this.play = true;
    this.interval = setInterval(async () => {
      let hasPendingTransaction = false;
      for (let i = 0; i < this.pendingtransactions.length; i++) {
        const transaction = this.pendingtransactions[i];
        if (transaction.status === 'pending') {
          const txid = transaction.txid;
          const coin = transaction.coin;
          const type = transaction.type;
          
          let confirmations = 0;
          if (type === 'Withdraw') {
            const status = await this.kanbanServ.getTransactionStatus(txid);
            transaction.status = status;
          } else
          if (type === 'Deposit') {
            const status = await this.kanbanServ.getDepositStatus(txid);
            transaction.status = status;
          } else
          if (coin === 'BTC') {
            const tx = await this.apiServ.getBtcTransaction(txid);
            if (tx) {
              confirmations = tx.confirmations;
              if (confirmations >= 1) {
                transaction.status = 'confirmed';
              }  
            }
          
          } else 
          if (coin === 'ETH' || transaction.tokenType === 'ETH') {
            const tx = await this.apiServ.getEthTransaction(txid);
            if (tx) {
              if (tx.blockNumber) {
                confirmations = tx.confirmations;
              }    
              if (confirmations >= 1) {
                const txStatus = await this.apiServ.getEthTransactionStatus(txid);
                if (txStatus.status) {
                  transaction.status = 'confirmed';
                } else {
                  transaction.status = 'failed';
                }
              }   
            }
 
          } else
          if (coin === 'FAB' || transaction.tokenType === 'FAB') {
            const tx = await this.apiServ.getFabTransactionJson(txid);
            if (tx) {
              if (tx.confirmations) {
                confirmations = tx.confirmations;
              }
              if (confirmations >= 1) {
                transaction.status = 'confirmed';
              }    
            }
         
          }
          if (transaction.status !== 'pending') {
            const array_first_five = txid.slice(0, 5);
            const array_last_five = txid.slice(-5);
            const txidSlice = array_first_five + '...' + array_last_five;
            this.alertServ.openSnackBar('transaction ' + txidSlice + ' was ' + transaction.status, 'Ok');
            console.log('i=' + i);
            const deleted = this.pendingtransactions.splice(i, 1);
            if (deleted && deleted.length > 0) {
              console.log('deleted=', deleted);
              const deletedItem = deleted[0];
              this.storageServ.updateTransactionHistoryList(deletedItem);
              this.storageServ.notifyTransactionItemChanged(deletedItem);
              this.closetransactions.push(deletedItem);              
            }

          }
          hasPendingTransaction = true;
        }
      }
      if (!hasPendingTransaction) {
        this.pauseTimer();
      }
    }, 3000);
  }

  pauseTimer() {
    this.play = false;
    clearInterval(this.interval);
  }

  linkTo(url: string) {
    this.router.navigate([url]);
  }

  setLan() {
    let lang = window.localStorage.getItem('Lan');

    if (!lang) {
      lang = navigator.language;
      lang = lang.substr(0, 2);
      if (lang === 'CN' || lang === 'cn') { lang = 'zh'; }
      localStorage.setItem('Lan', lang.toLowerCase());
    } else {
      if (lang === 'CN' || lang === 'cn') { lang = 'zh'; }
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
}
