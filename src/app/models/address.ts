import { Coin } from './coin';

export class Address {
    address: string;
    index: number;
    coinType: number; // bip44 coin type.
    isUsed: Boolean;
    nonce: number;
    balance: number;
    lockedBalance: number;
    constructor(coinType: number, address: string, index: number) {
        this.coinType = coinType;
        this.address = address;
        this.index = index;
        this.isUsed = false;
        this.nonce = 0;
        this.balance = 0;
        this.lockedBalance = 0;
    }
}
