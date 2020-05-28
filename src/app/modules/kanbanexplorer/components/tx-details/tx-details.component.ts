import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../models/transaction';
import { KanbanService } from '../../services/kanban.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tx-details',
  templateUrl: './tx-details.component.html',
  styleUrls: ['./tx-details.component.css']
})
export class TxDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private kanbanService: KanbanService,
    private router: Router) { }

  txhash: string;
  transaction: Transaction;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.txhash = params.get('txhash');
    });
    console.log('skjdflsdhskldhf');
    this.kanbanService.getTxByHash(this.txhash).subscribe((tx: Transaction) => {
      this.transaction = tx;
    }, ((e) => {
      console.log('in error');
      this.router.navigate([`/block-detail/`, this.txhash]);
    }));

  }

}
