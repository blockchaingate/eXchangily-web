// import { OrderBookItem } from '../modules/market/models/order-book';
import { number } from 'bitcoinjs-lib/types/script';

// import { Block } from 'bitcoinjs-lib';

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

export interface DepositStatusResp {
    code: number;
    message: string;
}

export interface TransactionAccountResponse {
transactionCount: number;
}
export interface OrderBookItem {
    asks: [][];
    bids: [][];
    lastUpdateId: number;
}

export interface TradeItem {
    E: number;
    M: boolean;
    T: number;
    a: number;
    b: number;
    e: string;
    m: boolean;
    p: string;
    q: string;
    s: string;
    t: number;
}
export interface Transaction {
    txid: string;
    orderHash: string;
    baseCoin: number;
    targetCoin: number;
    bidOrAsk: boolean;
    price: number;
    qty: number;
    status: string;
    created_at: Date;
}

export interface KanbanTransaction {
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

export interface OrderItem {
    p: number;
    q: number;
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
    base_id: number;
    coin_id: number;
    symbol: string;
    price: number; // latest price
    change24h: number; // 12.6%
    vol24h: number; // 24h volume
    price24hh: number;
    price24hl: Number;
}

export interface Ticker {
    e: string;
    E: number;
    s: string;
    p: string;
    P: string;
    w: string;
    x: string;
    c: string;
    Q: string;
    b: string;
    B: string;
    a: string;
    A: string;
    o: string;
    h: string;
    l: string;
    v: string;
    q: string;
    O: number;
    C: number;
    F: number;
    L: number;
    n: number;
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

export interface BlockNumber {
    blockNumber: string;
    blockNumberHex: string;
}
export interface BlockNumberResponse {
    blockNumber: BlockNumber;
}

export interface Block {
    difficulty: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    hash: string;
    hashNoSignature: string;
    logsBloom: string;
    miner: string;
    mixHash: string;
    nonce: string;
    number: number;
    parentHash: string;
    receiptsRoot: string;
    round: number;
    size: number;
    timestamp: number;
    totalDifficulty: string;
}

export interface TransactionsResponse {
    total_txs: number;
    txs: [KanbanTransaction];
}

export interface BlockResponse {
    block: Block;
}

export interface KanbanNonceResponse {
    nonce: number;
}

/*
export interface OrderItem {
    _id: string;
    orderHash: string;
    address: string;
    pairLeft: number;
    pairRight: number;
    orderType: number;
    bidOrAsk: boolean;
    price: number;
    orderQuantity: number;
    filledQuantity: number;
    time: number;
    isActive: boolean;
}
*/
export interface AccountsResponse {
    accounts: [string];
}

export interface KanbanGetBanalceItem {
    BTC: string;
    ETH: string;
    FAB: string;
}

export interface KanbanGetBanalceResponse {
    balance: KanbanGetBanalceItem;
}
export interface Token {
    type: string;     // ETH or FAB
    address: string;  // Contract Address
    name: string;
    symbol: string;
    decimals: number;
}

export interface EthTransactionObj {
    // transaction object from web3.eth.accounts.signTransaction
    messageHash: string;
    r: string;
    s: string;
    v: string;
    rawTransaction: string;
}

export interface SendCoinForm {
    to: string;
    coinIndex: number;
    amount: number;
    comment: string;
    gasPrice: number;
    gasLimit: number;
    satoshisPerBytes: number;
}
