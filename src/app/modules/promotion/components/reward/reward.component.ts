import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

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

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit() {
    this.referralCode = '32RY34';
  }
  onConfirmedPin(pin) {
    
  }
}
