import { Coin } from './coin';
import { Address } from './address';

export class MyCoin extends Coin {
    balance: number;
    lockedBalance: number;
    receiveAdds: Address[];
    changeAdds: Address[];
    constructor(name: string) {
        super(name);
        this.balance = 0;
        this.lockedBalance = 0;
        this.receiveAdds = new Array();
        this.changeAdds = new Array();
    }

}
