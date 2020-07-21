import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-market-home',
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.scss']
})
export class MarketHomeComponent implements OnInit {
  maintainence: boolean;

  constructor() {}
  
  ngOnInit() {
    this.maintainence = environment.maintainence;
  }
}
