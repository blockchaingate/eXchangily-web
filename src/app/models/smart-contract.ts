import {ABI} from '../models/interfaces';

export class SmartContract {
    id: number;
    name: string;
    address: string;
    abi: ABI;
    sourceCode: string;
    byteCode?: string;
    creator?: string;
    txid?: string;

    constructor(name: string, address: string, abi: Object, id?: number, sourceCode?: string,
                hexCode?: string, creator?: string, txid?: string) {
        if (id != null) {
            this.id = id;
        } else {
            this.id = Math.floor(Math.random() * 10000);
        }

        this.name = name;
        this.address = address;
        this.abi = <ABI> abi;
        this.sourceCode = sourceCode;
        this.byteCode = hexCode;
        this.creator = creator;
        this.txid = txid;
    }
}
