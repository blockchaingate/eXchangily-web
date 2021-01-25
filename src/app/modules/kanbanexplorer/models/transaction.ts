export interface Transaction {
    blockHash: string;
    blockNumber: number;
    from: string;
    gas: number;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: number;
    to: string;
    transactionIndex: number;
    value: string;
    v: string;
    r: string;
    s: string;
    confirmations: number;
}

export interface AddressTx {
    idx: number;
    txhash: string;
    block: number;
    timestamp: string;
    timestamp_n: number;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
}

export interface Balance {
    coinType: string;
    symbol: string;
    unlockedAmount: string;
    lockedAmount: string;
}

export interface TransactionCount {
    transactionCount: number;
}
