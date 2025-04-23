import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'transactionType'})
export class TransactionTypePipe implements PipeTransform {
  transform(transactionsArr: any, type?: string): number {
    if (!type || type === 'All') {
        return transactionsArr;
    }
    return transactionsArr.filter(transaction => (transaction.type === type));
  }
}
