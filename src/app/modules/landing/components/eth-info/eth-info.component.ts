import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-eth-info',
  templateUrl: './eth-info.component.html',
  styleUrls: ['./eth-info.component.scss']
})
export class EthInfoComponent implements OnInit {
  @Input() ethAdd: string;
  @Input() size: number;

  constructor() { }

  ngOnInit() {
  }

}
