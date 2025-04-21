import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../../services/kanban.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

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
  constructor(private kanbanServ: KanbanService, private route: ActivatedRoute, public utilServ: UtilService) { }

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
