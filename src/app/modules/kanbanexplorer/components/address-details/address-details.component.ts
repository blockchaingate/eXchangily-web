import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import { Balance, TransactionCount } from '../../models/transaction';
import { Order } from '../../models/order';
import { KanbanBalance } from '../../models/kanbanBalance';
import { BigNumber } from 'bignumber.js';
import { WithdrawRequest } from '../../models/withdrawRequest';
import { DepositRequest } from '../../models/depositRequest';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {
  address: string;
  balances: Balance[] = [];
  balancesDisplayedColumns = ['coinType', 'lockedAmount', 'unlockedAmount'];
  orders: Order[] = [];
  kanbanBalance: KanbanBalance;

  nonce: Number;
  withdrawReqs: WithdrawRequest[] = [];
  depositReqs: DepositRequest[] = [];

  constructor(private route: ActivatedRoute, private service: KanbanService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.address = params.get('address');
      console.log(this.address);

      // get all the responses from services here
      this.service.getAddressBalances(this.address).subscribe((bl: Balance[]) => {
        this.balances = bl;
        this.balances.forEach(b => {
          b.coinType = this.service.getCurrencyName(b.coinType);
        });
        console.log(this.balances);
      });

      this.service.getAddressOrders(this.address).subscribe((orders: Order[]) => {
        this.orders = orders;
        this.orders.forEach((o) => {
          o.originalOrderQuantity = this.getHumanReadableFormat(o.originalOrderQuantity);
          o.currentOrderQuantity = this.getHumanReadableFormat(o.currentOrderQuantity);
          o.filledQuantity = this.getHumanReadableFormat(o.filledQuantity);

          o.matchedOrders.forEach((m) => {
            m.price = this.getHumanReadableFormat(m.price);
            m.quantity = this.getHumanReadableFormat(m.quantity);
          });

        });
        // console.log(orders)
      });

      this.service.getAddressKanbanBalance(this.address).subscribe((b: KanbanBalance) => {
        this.kanbanBalance = b;
        Object.keys(this.kanbanBalance.balance).forEach((k, v) => {
          this.kanbanBalance.balance[k] = (new BigNumber(this.kanbanBalance.balance[k], 16)).toString();
        });
      });

      this.service.getAddressTxCount(this.address).subscribe((r: TransactionCount) => {
        this.nonce = r.transactionCount;
      });

      this.service.getAddressWithdrawRequests(this.address).subscribe((w: WithdrawRequest[]) => {
        this.withdrawReqs = w;
        this.withdrawReqs.forEach((w) => {
          w.value = this.getHumanReadableFormat(w.value);
        });
      });

      this.service.getAddressDepositRequests(this.address).subscribe((d: DepositRequest[]) => {
        this.depositReqs = d;

        this.depositReqs.forEach((d) => {
          d.value = this.getHumanReadableFormat(d.value);
        });
      });
    });
  }

  getHumanReadableFormat(num: string): string {
    return (new BigNumber(num).multipliedBy(new BigNumber(1e-18))).toFixed(18);
  }

}
