export interface OrderElement {
    pair: string;
    amount: number;
    bid: boolean,
    orderHash: string,
    owner: string;
    price: number;
    status: number;
    timestamp: number;
    txid: string;
}