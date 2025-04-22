import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Transaction } from '../../models/transaction';
import { KanbanService } from '../../services/kanban.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tx-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatSpinner, TranslateModule],
  templateUrl: './tx-details.component.html',
  styleUrls: ['./tx-details.component.css']
})
export class TxDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private kanbanService: KanbanService,
    private router: Router) { }

  txhash = '';
  status = '';
  transaction: Transaction = {} as Transaction;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.txhash = params.get('txhash') || '';
    });
    console.log('skjdflsdhskldhf');
    this.kanbanService.getTxByHash(this.txhash).subscribe(async (tx: Transaction) => {
      this.transaction = tx;
      const txid = tx.hash;
      this.status = await this.kanbanService.getTransactionStatus(txid);
    }, ((e) => {
      console.log('in error');
      this.router.navigate([`/block-detail/`, this.txhash]);
    }));

  }

}
