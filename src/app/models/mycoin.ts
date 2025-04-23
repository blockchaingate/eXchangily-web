import { Coin } from './coin';
import { Address } from './address';

export class MyCoin extends Coin {
    new: boolean;
    encryptedPrivateKey: any;
    balance: number;
    logo: string;
    unconfirmedBalance: number;
    lockedBalance: number;
    lockers: any;
    receiveAdds: Address[];
    changeAdds: Address[];
    tokenType: string;
    baseCoin: MyCoin;
    usdPrice: number;
    redeposit: any[];
    depositErr: any[];
    contractAddr: string;

    constructor(name: string) {
        super(name);
        this.new = false;
        this.balance = 0;
        this.usdPrice = 0;
        this.lockedBalance = 0;
        this.tokenType = '';
        this.contractAddr = '';
        this.receiveAdds = new Array();
        this.changeAdds = new Array();
        this.baseCoin = null;
    }

}
