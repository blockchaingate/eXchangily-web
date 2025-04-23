import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderPipe'})
export class OrderPipe implements PipeTransform {
  transform(ordersArr: any, bidOrAsk: boolean, currentStatus: number): any {
    if(!ordersArr) {
      return [];
    }
    const filterOrders = ordersArr.filter(
        order =>
        order.items && (order.items.length > 0) && 
        (order.items[0].buy == bidOrAsk) && 
        (order.paymentStatus == currentStatus));
    return filterOrders;
  }
}
