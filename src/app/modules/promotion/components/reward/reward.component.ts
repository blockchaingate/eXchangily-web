import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CampaignOrderService } from 'src/app/services/campaignorder.service';
import { StorageService } from '../../../../services/storage.service';
import { environment } from '../../../../../environments/environment';
import { MemberModal } from '../../modals/member/member.component';

import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { TeamComponent } from 'src/app/modules/landing/features/home/team/team.component';
import { TranslateService } from '@ngx-translate/core';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Jacky(7)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3',
    children: [
      { name: 'Ming(5)' + ' ' + '0x9f35a499924ab58ddeed21462f3b788c25272e1b' },
      { name: 'John(3)' + ' ' + '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b' },
      { name: 'Douglas(2)' + ' ' + '0x41a6a6eb10408617950880cfc2fb3aeab800bafa' },
    ]
  }, {
    name: 'Michile(8)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3',
    children: [
      { name: 'Chan(5)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3' },
      { name: 'Roma(3)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3' },
      { name: 'Alice(6)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3' },
    ]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})

export class RewardComponent implements OnInit {

  referralCode: string;
  teamsRewards: number;
  totalEXG = 0;
  totalNextEXG = 0;
  totalValue = 0;
  totalQuantities = 0;
  extraEXG = 0;
  baseUrl: string;
  membership: string;
  members: any = [];

  @ViewChild('chart1', { static: false }) chart1: ElementRef;
  @ViewChild('memberModal', { static: true }) memberModal: MemberModal;
  type: ChartType = 'Bar';
  dataPersonal1: any = {
    labels: [
      this.translateServ.instant('level 1'),
      this.translateServ.instant('level 2'),
      this.translateServ.instant('level 3')
    ],
    series: [
      []
    ]
  };

  dataPersonal2: any = {
    labels: [
      this.translateServ.instant('level 1'),
      this.translateServ.instant('level 2'),
      this.translateServ.instant('level 3')
    ],
    series: [
      []
    ]
  };

  data2: any = {
    series: []
  };

  data2Options: any = {
    donut: true,
    showLabel: true
  };

  openMemberModal() {
    this.memberModal.show();
  }
  options: IBarChartOptions = {
    axisX: {
      showGrid: false
    },
    axisY: {
      showLabel: true,
      onlyInteger: true,
    },

    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 30
    },
    height: 300
  };

  events: ChartEvent = {
    draw: (data) => {
      if (data.type === 'bar') {
        data.element.animate({
          y2: <IChartistAnimationOptions>{
            dur: '0.5s',
            from: data.y1,
            to: data.y2,
            easing: 'easeOutQuad'
          }
        });
      }
    }
  };

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private translateServ: TranslateService,
    private cd: ChangeDetectorRef, 
    private storageService: StorageService, 
    private campaignorderServ: CampaignOrderService) {

    this.storageService.getToken().subscribe(
      (token: any) => {
        this.campaignorderServ.getRewards(token).subscribe(
          (res: any) => {
            console.log(res);
          }
        );
      });
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  getTotalEXGValue() {
    if (this.totalEXG) {
      return Number((this.totalEXG * 0.25).toFixed(0));
    }
    return 0;
  }

  copyMessage(){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl+'/login/signup/'+this.referralCode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
    this.teamsRewards = 0;
    this.referralCode = '';

    this.storageService.getToken().subscribe(
      (token: any) => {

        this.campaignorderServ.getProfile(token).subscribe(
          (res2: any) => {
            if (res2 && res2.ok) {
              console.log('res2=', res2);
              this.referralCode = res2._body.referralCode;
              this.membership = res2._body.membership;
              this.totalQuantities = res2._body.totalQuantities;
              this.totalValue = res2._body.totalValue;
              this.campaignorderServ.getRewards(token).subscribe(
                (res3: any) => {
                  if (res3 && res3.ok) {
                    const rewards = res3._body;

                    if (rewards && rewards.personal && (rewards.personal.length > 0)) {
                      for (let i = 0; i < rewards.personal.length; i++) {
                        const reward = rewards.personal[i];
                        for(let j = 0; j < reward.users.length; j++) {
                          const u = reward.users[j];
                          const member: any = {
                            level: reward.level,
                            email: u.memberId.email
                          };
                          this.members.push(member);
                        }
                        this.totalEXG += reward.totalRewardQuantities;

                        this.totalNextEXG += reward.totalRewardNextQuantities;

                        this.dataPersonal1.series[0].push(reward.totalAccounts);
                        this.dataPersonal2.series[0].push(reward.totalRewardQuantities);
                      }

                      if (this.totalEXG) {
                        this.totalEXG = Number(this.totalEXG.toFixed(0));
                      }

                      if (this.totalNextEXG) {
                        this.totalNextEXG = Number(this.totalNextEXG.toFixed(0));
                      }
                      if (this.totalNextEXG && this.totalNextEXG) {
                        this.extraEXG = Number((this.totalNextEXG - this.totalEXG).toFixed(0));
                      }

                      if (rewards && rewards.teamsRewards) {
                        this.teamsRewards = rewards.teamsRewards;
                        for (let i = 0; i < rewards.team.length; i++) {
                          const t = rewards.team[i];
                          const percentage = Number(t.percentage.toFixed(0));
                          if (percentage > 0) {
                            this.data2.series.push(percentage);
                          }

                        }
                      }
                      this.dataPersonal1 = { ...this.dataPersonal1 };
                      this.dataPersonal2 = { ...this.dataPersonal2 };
                      this.data2 = { ...this.data2 };
                    }
                  }
                }
              )
            }
          }
        );

      });
  }
  
  onConfirmedPin(pin) {

  }
}
