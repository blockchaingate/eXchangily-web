import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { CampaignOrderService } from 'src/app/services/campaignorder.service';
import {StorageService} from '../../../../services/storage.service';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { TeamComponent } from 'src/app/modules/landing/features/home/team/team.component';





interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Jacky(7)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3',
    children: [
      {name: 'Ming(5)' + ' ' + '0x9f35a499924ab58ddeed21462f3b788c25272e1b'},
      {name: 'John(3)' + ' ' + '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b'},
      {name: 'Douglas(2)' + ' ' + '0x41a6a6eb10408617950880cfc2fb3aeab800bafa'},
    ]
  }, {
    name: 'Michile(8)'  + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3',
    children: [
      {name: 'Chan(5)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3'},
      {name: 'Roma(3)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3'},
      {name: 'Alice(6)' + ' ' + '0xa2a3720c00c2872397e6d98f41305066cbf0f8b3'},
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
  styleUrls: ['./reward.component.css']
})



export class RewardComponent implements OnInit {
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  referralCode: string;
  teamsRewards: number;
  totalEXG = 0;
  totalNextEXG = 0;
  membership: string;


  type: ChartType = 'Bar';
  dataPersonal1: any = {
    labels: [
      'level 1',
      'level 2',
      'level 3'
    ],
    series: [
      []
    ]
  };

  dataPersonal2: any = {
    labels: [
      'level 1',
      'level 2',
      'level 3'
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
    showLabel: false
  };

  options: IBarChartOptions = {
    axisX: {
      showGrid: false
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

  constructor(private cd: ChangeDetectorRef, private storageService: StorageService, private campaignorderServ: CampaignOrderService) {

    this.storageService.getToken().subscribe(
      (token:string) => {      
        this.campaignorderServ.getRewards(token).subscribe(
          (res:any) => {
            console.log(res);
          }
        );
    });
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  getTotalEXGValue() {
    if(this.totalEXG) {
      return Number((this.totalEXG * 0.25).toFixed(2));
    }
    return 0;
  }
  ngOnInit() {
    this.teamsRewards = 0;
    this.referralCode = '';

    this.storageService.getToken().subscribe(
      (token:string) => {    
        
        this.campaignorderServ.getProfile(token).subscribe(
          (res2:any) => {
            if(res2 && res2.ok) {
              console.log('res2=', res2);
              this.referralCode = res2._body.referralCode;
              this.membership = res2._body.membership;

              this.campaignorderServ.getRewards(token).subscribe(
                (res3: any) => {
                  if(res3 && res3.ok) {
                    const rewards = res3._body;

                    if(rewards && rewards.personal && (rewards.personal.length > 0)) {
                      for(let i=0;i<rewards.personal.length;i++) {
                        const reward = rewards.personal[i];
                        this.totalEXG += reward.totalRewardQuantities;
                        console.log('reward=', reward);
                        console.log('this.totalEXG==', this.totalEXG);
                        this.totalNextEXG += reward.totalRewardNextLevelAmount;

                        
                        this.dataPersonal1.series[0].push(reward.totalQuantities);
                        this.dataPersonal2.series[0].push(reward.totalRewardQuantities);
                      }

                      if(this.totalEXG) {
                        this.totalEXG = Number(this.totalEXG.toFixed(2));
                      }

                      if(this.totalNextEXG) {
                        this.totalNextEXG = Number(this.totalNextEXG.toFixed(2));
                      }    

                      if(rewards && rewards.teamsRewards) {
                        this.teamsRewards = rewards.teamsRewards;
                        for(let i=0;i<rewards.team.length;i++) {
                          const t = rewards.team[i];
                          this.data2.series.push(t.totalValueAdjustment ? t.totalValueAdjustment : t.totalValue);
                        }
                      }

                      this.cd.detectChanges();

                    }
                    console.log('rewards=', rewards);
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
