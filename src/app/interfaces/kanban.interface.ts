export interface OfficialAddress {
    name: string;
    address: string;
}

export interface TransactionResp {
    transactionHash: string;
}

export interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    status: string;
}

export interface TransactionReceiptResp {
    transactionReceipt: TransactionReceipt;
}

export interface Transaction {
    txid: string;
    baseCoin: number;
    targetCoin: number;
    bidOrAsk: boolean;
    price: number;
    qty: number;
    status: string;
    created_at: Date;
}

export interface Order {
    orderHash: string;
    bidOrAsk: boolean;
    baseCoin: number;
    targetCoin: number;
    price: number;
    amount: number;
    orderType: number;
}

export interface Price {
    id: number;
    coin_id: number; 
    base_id: number;
    price: number; // latest price
    change24h: number; // 12.6%
    price24hh: number; // 24h high
    price24hl: number; // 24h low
    vol24h: number; // 24h volume
    favorite: number; // 1 fovorite, 0 not
}

export interface Coin {
    id: number;
    name: string;
    icon: string;
}

export interface Signature {
    r: string;
    s: string;
    v: string;
}