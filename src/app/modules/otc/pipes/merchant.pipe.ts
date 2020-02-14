import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'merchantPipe'})
export class MerchantPipe implements PipeTransform {
  transform(merchantsArr: any, currency: string, bidOrAsk: boolean, coinName: string): number {

    return merchantsArr.filter(
        merchant => (merchant.Currency === currency) && 
        (merchant.BidOrAsk === bidOrAsk) && 
        (merchant.CoinName === coinName));
  }
}
