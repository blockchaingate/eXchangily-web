import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../../../services/reward.service';
import { UtilService } from '../../../../services/util.service';
import { environment } from 'src/environments/environment';

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
  periods: any;
  pairs = [
    'BTCUSDT',
    'ETHUSDT',
    'LTCUSDT',
    'FABUSDT',
    'EXGUSDT'
  ];

  constructor(private rewardService: RewardService, public utilServ: UtilService) {
  }  
  ngOnInit() {
    this.totalReward = 0;
    this.totalReward2 = 0;
    this.rewardService.getPeriods().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const body = res._body;
          this.periods = body;
        }
      }
    );
  }

  getProofLink(pair, period) {
    const url = 'https://kanban' + (environment.production ? 'prod' : 'test') + '.fabcoinapi.com/' + 'tradesbypairbetweenblocks/' 
    + pair + '/' + period.startBlock + '/' + period.endBlock;
    return url;
  }
}



/*
url = 'https://kanban' + (secret.production ? 'prod' : 'test') + '.fabcoinapi.com/' + 'tradesbypairbetweenblocks/' 
        + pair + '/' + startBlock + '/' + endBlock;
*/