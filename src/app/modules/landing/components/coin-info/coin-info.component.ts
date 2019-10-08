import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-coin-info',
  templateUrl: './coin-info.component.html',
  styleUrls: ['./coin-info.component.scss']
})
export class CoinInfoComponent implements OnInit {
  @Input() coin: String;
  @Input() coinAdd: String;
  @Input() size: number;

  constructor() { }

  ngOnInit() {
  }

}
