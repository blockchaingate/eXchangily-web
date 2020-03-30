import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { CoinOrderService } from 'src/app/services/coinorder.service';
import {StorageService} from '../../../../services/storage.service';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';





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






  type: ChartType = 'Bar';
  data: IChartistData = {
    labels: [
      'level 1',
      'level 2',
      'level 3'
    ],
    series: [
      [10,57, 201],
      [125, 234, 583],
      [32, 28, 97]
    ]
  };

  data2: IChartistData = {
    labels: [
      'team 1',
      'team 2',
      'team 3',
      'team 4',
      'team 5',
      'team 6',
      'team 7',
      'team 8'
    ],
    series: [
      [10,57, 201, 23, 445, 45, 56, 76],
      [125, 234, 583, 223, 445, 534, 553, 785],
      [32, 28, 97, 45, 67, 45, 67, 124]
    ]
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

  constructor(private storageService: StorageService, private coinorderServ: CoinOrderService) {

    this.storageService.getToken().subscribe(
      (token:string) => {      
        this.coinorderServ.getRewards(token).subscribe(
          (res:any) => {
            console.log(res);
          }
        );
    });
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit() {
    this.referralCode = '32RY34';

    this.storageService.getToken().subscribe(
      (token:string) => {      
        this.coinorderServ.getRewards(token).subscribe(
          (res: any) => {
            console.log('rewards res=', res);
          }
        )
      });
  }
  onConfirmedPin(pin) {
    
  }
}
