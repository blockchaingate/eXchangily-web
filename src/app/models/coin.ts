import { Blockchain } from './blockchain';

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
        this.coinType = 1;
        this.decimals = 8;
    } else
    if (name === 'ETH') {
        this.coinType = 60;
        this.decimals = 18;
    } else
    if (name === 'USDT') {
        this.coinType = 1550;
        this.decimals = 8;
    } else
    if (name === 'EXG') {
        this.coinType = 1551;
        this.decimals = 8;
    } else
    if (name === 'FAB' || name === 'EX') {
        this.coinType = 115;
        this.decimals = 8;
    }
   } 
}
