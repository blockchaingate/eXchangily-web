export enum OrderType {
    MARKET,
    LIMIT,
    STOP
}

export enum OrderStatus {
    UNFILLED,
    PARTIALFILLED,
    FILLED,
    CANCELLED,
    INACTIVE
}

export interface Order {
    id?: string;
    pair: string; // FAB/ETH
    buy: boolean;
    type?: string; // market, limit, stop
    price: number; // latest price
    rate: number; // rate * qty = amount.
    qty: number;
    amount: number; // Used coin amount
    filledQty?: number;
    margin?: number;
    deadline?: Date;
    condition?: string;
    status?: string;
    dateCreated?: Date;
}
