import { Component, OnInit, ViewChild } from '@angular/core';
// import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { MarketTopComponent } from '../top/market-top.component';
import { MarketListComponent } from '../list/market-list.component';
// import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-market-home',
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.css']
})
export class MarketHomeComponent implements OnInit {
  showAdv = true;
  // socket: any;
  constructor() {

  }
  ngOnInit() {
    if (window.screen.width <= 1280) { // 768px portrait
      this.showAdv = false;
    }
    /*
    this.socket = new WebSocketSubject(environment.websockets.allprices);
    this.socket.subscribe(
      (arr) => {
        this.marketTop.updateTickerList(arr);
        this.marketList.updateTickerList(arr);
      }
    ); 
    */
  }
}
