import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../../../services/reward.service';
import { UtilService } from '../../../../services/util.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reward-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {
  traderewards: any;
  currentTradereward: any;
  totalReward = 0;
  totalReward2 = 0;
  id = '';
  private sub: any;

  constructor(private route: ActivatedRoute, private rewardService: RewardService, public utilServ: UtilService) {
  }

  ngOnInit() {
    this.totalReward = 0;
    this.totalReward2 = 0;

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      this.rewardService.getRewards(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const body = res._body;
            console.log('body=', body);
            this.traderewards = body;
            for (let i = 0; i < body.length; i++) {
              const item = body[i];
              this.totalReward += item.reward;
              this.totalReward2 += item.reward2;
            }
          }
        }
      );
      // In a real app: dispatch action to load the details here.
    });

  }

  setTradereward(tradereward: any) {
    console.log('setTradereward===', tradereward);
    this.currentTradereward = tradereward;
  }

  close() {
    this.currentTradereward = null;
  }
}