import { TextWithCheckboxFieldCustomInfo } from 'src/assets/charting_library/charting_library.min';

export interface TxRef {
    tx_hash: string;
    tx_output_n: number;
    value: number;
    ref_balance: number;
    spent: boolean;
    confirmations: number;
}
export interface Balance {
    address: string;
    balance: number;
    total_received: number;
    total_sent: number;
    unconfirmed_balance: number;
    final_balance: number;
    n_tx: number;
    unconfirmed_n_tx: number;
    final_n_tx: number;
    txrefs: [TxRef];
}

export interface EthBalance {
    message: string;
    result: number;
    status: number;
}

export interface Utxo {
    value: number;
    txid: string;
    block: number;
    sequence: number;
}

export interface FabTransactionResult {
    address: string;
    utxos: [Utxo];
}

export interface FabTransaction {
    result: [FabTransactionResult];
    status: string;
}

export interface FabTransactionResponse {
    comments: string;
    txid: string;
}
export interface TxBtc {
    address: [string],
    block_height: number,
    block_index: number,
    confirmations: number,
    double_spend: boolean,
    fees: number,
    hash: string,
    preference: string,
    received: string,
    relayed_by: string,
    size: number,
    total: number,
    ver: number,
    vin_sz: number;
    vout_sz: number;
}

export interface OriginalMessage {
    // defined in https://github.com/blockchaingate/devdoc/blob/master/kanban/deposit.md
    
}

export interface BtcTransaction {
    tx: TxBtc;
}

export interface EthTransaction {
    id: number;
    jsonrpc: string;
    result: string;
}