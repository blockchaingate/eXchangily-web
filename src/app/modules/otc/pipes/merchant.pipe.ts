import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'merchantPipe'})
export class MerchantPipe implements PipeTransform {
  transform(merchantsArr: any, currency: string, bidOrAsk: boolean, coinName: string): any {
    if(!merchantsArr) {
      return [];
    }
    const filterMerchants = merchantsArr.filter(
        merchant => (merchant.fiat === currency) && 
        (merchant.buy !== bidOrAsk) && 
        (merchant.coin === coinName));
    return filterMerchants;
  }
}
