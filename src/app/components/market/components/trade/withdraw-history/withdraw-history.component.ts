import { Component, OnInit } from '@angular/core';
import { KanbanV2Service } from '../../../../../services/kanban-v2.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../../services/util.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-withdraw-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule],
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit {
  transactions: any;
  displayedColumns: string[] = ['Coin', 'Quantity', 'Address', 'Transaction ID', 'Block Number'];

  constructor(private kanbanServ: KanbanV2Service, private route: ActivatedRoute, public utilServ: UtilService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const address = params['address'];
      this.kanbanServ.getWithdrawTransactions(address).subscribe(
        (res: any) => {
          this.transactions = res;
        }
      );
    });
  }

}
