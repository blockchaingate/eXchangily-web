import { Injectable } from '@angular/core';
import { Icotx } from '../../models/icotx';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {
  icotx: any;
  appCoinSymbol: string; // to this transaction, app receipient coin symbol
  appCoinAddress: string; // to this transaction, app receipient coin address.

  constructor() { }

  getPayment(index: number) {
    return this.icotx.payment[index];
  }

  payInCrypto(index: number): boolean {
    const pay = this.icotx.payment[index].payMethod;
    let isCrypto = false;
    if (pay === 'eth' ||
        pay === 'btc' ||
          pay === 'fab') {
      isCrypto = true;
    }
    return isCrypto;
  }

  getPayMethod(index?: number) {
    let method = 'usd';
    if (index !== undefined && index !== null) {
      method = this.icotx.payment[index].payMethod;
    }
    return method;
  }

  objectWithTransitIDs(transIds: Array<any>, payAddresses?: {btcAddress: string, ethAddress: string, fabAddress: string}): Icotx {
    const order = this.icotx;

    for (let i = 0; i < order.payment.length; i++) {
      order.payment[i].transitId = transIds[i].transitId;
    }

    // include address
    if (payAddresses) {
      order.ethAddress = payAddresses.ethAddress;
      order.btcAddress = payAddresses.btcAddress;
      order.fabAddress = payAddresses.fabAddress;
    }

    return order;
  }

  clearOrder() {
    this.icotx = undefined;
  }
}
