import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { IssueToken } from '../../../interfaces/fab.interface';

@Component({
  selector: 'app-issue-token-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class IssueTokenHistoryComponent implements OnInit {
  @Input() txs: IssueToken[] = [];

  constructor(private utilServ: UtilService) { }

  ngOnInit() {
  }

  showLongString(str: string) {
    if (str) {
      return str.substring(0, 3) + '...' + str.substring(str.length - 3);
    }
    return '';
  }

  copy(str: string) {
    this.utilServ.copy(str);
  }
}
