import { Component, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { RewardService } from '../../../../services/reward.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { KanbanService } from '../../../../services/kanban.service';
import { Web3Service } from '../../../../services/web3.service';
import { WalletService } from '../../../../services/wallet.service';
import { AlertService } from '../../../../services/alert.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import BigNumber from 'bignumber.js/bignumber';
import { TransactionResp } from '../../../../interfaces/kanban.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-reward-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  traderewards: any;
  currentTradereward: any;
  totalReward: number;
  totalReward2: number;
  constructor(private rewardService: RewardService, public utilServ: UtilService) {
  }  
  ngOnInit() {
    this.totalReward = 0;
    this.totalReward2 = 0;
    this.rewardService.getRewards().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const body = res._body;
          console.log('body=', body);
          this.traderewards = body;
          for(let i=0;i<body.length; i++) {
            const item = body[i];
            this.totalReward += item.reward;
            this.totalReward2 += item.reward2;
          }
        }
      }
    );
  }

  setTradereward(tradereward) {
    console.log('setTradereward===', tradereward);
    this.currentTradereward = tradereward;
  }

  close() {
    this.currentTradereward = null;
  }
}