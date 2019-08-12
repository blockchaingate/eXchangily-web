export class Utxo {
    txid: string;
    type: string;
    addIndex: number;
    txIndex: number;
    amount: number;
    address?: string;
    alias?: string;

    constructor(type: string, addressIndex: number, txid: string, amount: number, voutIndex: number) {
        this.type = type;
        this.addIndex = addressIndex;
        this.txid = txid;
        this.txIndex = voutIndex;
        this.amount = amount;
    }

}

