import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { IssueToken } from '../../../models/fab.interface';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-issue-token-history',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
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
