import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import { UtilService } from '../../../../services/util.service';
import { Balance, TransactionCount } from '../../models/transaction';
import { Order } from '../../models/order';
import { KanbanBalance } from '../../models/kanbanBalance';
import { BigNumber } from 'bignumber.js';
import { WithdrawRequest } from '../../models/withdrawRequest';
import { DepositRequest } from '../../models/depositRequest';
import { CoinService } from '../../../../services/coin.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css'],
  providers: [CoinService]
})
export class AddressDetailsComponent implements OnInit {
  address = '';
  balances: Balance[] = [];
  balancesDisplayedColumns = ['coinType', 'lockedAmount', 'unlockedAmount'];
  orders: Order[] = [];
  kanbanBalance: KanbanBalance = {} as KanbanBalance;

  nonce = 0;
  withdrawReqs: WithdrawRequest[] = [];
  depositReqs: DepositRequest[] = [];

  constructor(
    private coinServ: CoinService,
    private route: ActivatedRoute, private service: KanbanService, private utilServ: UtilService) { }

  getValue(value: any) {
    return new BigNumber(value).shiftedBy(-18).toNumber();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.address = params.get('address') || '';
      console.log(this.address);
      let address = this.address.trim();
      if (!address.startsWith('0x')) {
        address = this.utilServ.fabToExgAddress(this.address);
      }
      // get all the responses from services here
      this.service.getAddressBalances(address).subscribe((bl: Balance[]) => {
        this.balances = bl;
        this.balances.forEach(b => {
          b.symbol = this.service.getCurrencyName(b.coinType);
        });
        console.log(this.balances);
      });

      this.service.getAddressOrders(address).subscribe((orders: Order[]) => {
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

      this.service.getAddressKanbanBalance(address).subscribe((b: KanbanBalance) => {
        this.kanbanBalance = b;
        Object.keys(this.kanbanBalance.balance).forEach((k) => {
          const key = k as keyof typeof this.kanbanBalance.balance;
          this.kanbanBalance.balance[key] = (new BigNumber(this.kanbanBalance.balance[key].toString(), 16)).toString();
        });
      });

      this.service.getAddressTxCount(address).subscribe((r: TransactionCount) => {
        this.nonce = r.transactionCount;
      });

      this.service.getAddressWithdrawRequests(address).subscribe((w: WithdrawRequest[]) => {
        this.withdrawReqs = w;
        this.withdrawReqs.forEach((w2) => {
          w2.value = this.getHumanReadableFormat(w2.value);
        });
      });

      this.service.getAddressDepositRequests(address).subscribe((d: DepositRequest[]) => {
        this.depositReqs = d;

        this.depositReqs.forEach((d2) => {
          d2.value = this.getHumanReadableFormat(d2.value);
        });
      });
    });
  }

  getHumanReadableFormat(num: string): string {
    return new BigNumber(num).shiftedBy(-18).toFixed(18);
  }

  getCoinName(coin_id: number) {
    return this.coinServ.getCoinNameByTypeId(coin_id);
  }
}
