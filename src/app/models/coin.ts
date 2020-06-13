import { Blockchain } from './blockchain';

import { environment } from '../../environments/environment';
export class Coin {
    name: string;
    symbol: string;
    desc?: string;
    decimals: number;
    coinType: number; // Bip44 cointype
    blockchain: Blockchain;

   constructor(name: string) {
    this.name = name;
    this.symbol = name;
    if (name === 'BTC') {
        this.coinType = environment.CoinType.BTC;
        this.decimals = 8;
    } else
    if (name === 'ETH') {
        this.coinType = environment.CoinType.ETH; 
        this.decimals = 18;
    } else
    if (name === 'USDT') {
        this.coinType = environment.CoinType.ETH;
        this.decimals = 6;
    } else
    if (name === 'EXG') {
        this.coinType = environment.CoinType.FAB;
        this.decimals = 18;
    } else
    if (name === 'FAB' || name === 'EX') {
        this.coinType = environment.CoinType.FAB;
        this.decimals = 8;
    } else 
    if (name === 'DUSD') {
        this.coinType = environment.CoinType.FAB;
        this.decimals = 6;
    } else 
    if (name === 'BCH') {
        this.coinType = environment.CoinType.BCH;
        this.decimals = 8;
    } else 
    if (name === 'LTC') {
        this.coinType = environment.CoinType.LTC;
        this.decimals = 8;
    } else 
    if (name === 'DOGE') {
        this.coinType = environment.CoinType.DOGE;
        this.decimals = 8;
    }
   } 
}
