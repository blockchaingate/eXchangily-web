import { Coin } from './coin';
import { Utxo } from './utxo';
import { Coinbase } from './coinbase';
import { ScriptPubKey } from './scriptpubkey';

export class Transaction {
    txid: string;
    hash: string;
    time: number;
    toAdd: string;
    amount: number;
    fee: number;
    coin: Coin;
}

export class BitcoinTransaction extends Transaction {
    vin: (Coinbase | Utxo)[];
    vout: { value: number, n: number, scriptPubKey: ScriptPubKey }[];
}

export class EthereumTransaction extends Transaction {

}

