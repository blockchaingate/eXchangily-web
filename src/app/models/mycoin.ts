import { Coin } from './coin';
import { Address } from './address';

export class MyCoin extends Coin {
    balance: number;
    lockedBalance: number;
    receiveAdds: Address[];
    changeAdds: Address[];
    tokenType: string;
    coinType: number;
    baseCoin: MyCoin;
    decimals: number;
    redeposit: any[];
    contractAddr: string;

    constructor(name: string) {
        super(name);
        this.balance = 0;
        this.coinType = 0;
        this.lockedBalance = 0;
        this.decimals = 18;
        this.tokenType = '';
        this.contractAddr = '';
        this.receiveAdds = new Array();
        this.changeAdds = new Array();
        this.baseCoin = null;
    }

}
