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
export class MarketHomeComponent  implements OnInit {
  @ViewChild('marketTop', {static: true}) marketTop: MarketTopComponent;
  @ViewChild('marketList', {static: true}) marketList: MarketListComponent;
  // socket: any;
  constructor() {

  }
  ngOnInit() {
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

  ngOnDestroy() {
    // this.socket.unsubscribe();
  }  
}
