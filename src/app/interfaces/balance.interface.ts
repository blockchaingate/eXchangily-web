import { TextWithCheckboxFieldCustomInfo } from 'src/assets/charting_library/charting_library.min';

export interface TxRef {
    tx_hash: string;
    tx_output_n: number;
    value: number;
    ref_balance: number;
    spent: boolean;
    confirmations: number;
}

export interface JsonResult {
    jsonrpc: string,
    id: number,
    result: any
}

export interface GasPrice {
    gasprice: number;
}

export interface Balance {
    /*
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
    */
   balance: number;
   lockbalance: number;
}

export interface BtcUtxo {
    txid: string;
    idx: number;
    address: string;
    value: number;
    blockheight: number;
}

export interface EthBalance {
    message: string;
    result: number;
    status: number;
}

export interface ExecutionResult {
    codeDeposit: number;
    depositSize: number;
    excepted: string;
    gasForDeposit: number;
    gasRefunded: number;
    gasUsed: number;
    newAddress: string;
    output: string;
}

export interface TransactionReceipt {
    bloom: string;
    gasUsed: number;
    stateRoot: string;
}

export interface FabTokenBalance {
    address: string;
    comments: string;
    executionResult: ExecutionResult;
    transactionReceipt: TransactionReceipt;
}

export interface KEthBalance {
    balance: number;
}

export interface FabUtxo {
    txid: string;
    idx: number;
    address: string;
    value: number;
    blockheight: number;
}

export interface FabVin {
    coinbase: string;
    sequence: number;
}

export interface FabTransactionJson {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    locktime: number;
    vin: [FabVin];
    hex: number;
    confirmations: number;
    blockhash: string;
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

export interface BtcTransactionResponse {
    txid: string;
}

export interface BtcTransaction {
    blockhash: string;
    blocktime: number;
    confirmation: number;
    hash: string;
    hex: string;
    locktime: number;
    size: number;
    time: number;
    txid: string;
    version: number;
    vsize: number;
    weight: number;
}

export interface EthTransactionRes {
    blockHash: string;
    blockcNumber: number;
    confirmations: number;
    from: string;
    gas: number;
    gasPrice: number;
    hash: string;
    nonce: number;
    transactionIndex: number;
    value: number;
}


export interface EthTransactionStatusRes {
    txhash: string;
    status: boolean;
}

export interface FabTransactionResponse {
    comments: string;
    txid: string;
    Error: string;
}
export interface TxBtc {
    address: [string];
    block_height: number;
    block_index: number;
    confirmations: number;
    double_spend: boolean;
    fees: number;
    hash: string;
    preference: string;
    received: string;
    relayed_by: string;
    size: number;
    total: number;
    ver: number;
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

export interface CoinsPrice {
    exgcoin: {
        usd: number
    };    
    bitcoin: {
        usd: number
    };
    ethereum: {
        usd: number
    };
    fabcoin: {
        usd: number
    };
    tether: {
        usd: number
    };           
}

