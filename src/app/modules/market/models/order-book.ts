
import { Order } from './order';

export interface OrderBook {
    id?: string;
    pair: string; // FAB/ETH
    digits: number;
    buys: Order[];
    sells: Order[];
    currentRate: number;
    minAmt: number;
    maxAmt: number;
    maxUp: number;
    maxDown: number;
    active: boolean;
    currentTime: Date;
}

export interface OrderBookItem {
    price: number;
    quantity: number;
    acumulate?: number;
}

export interface OrderBookDisplay {
    pair: string;
    sells: OrderBookItem[];
    buys: OrderBookItem[];
}

export interface TxRecord {
    price: number;
    quantity: number;
    time: Date;
    orderHash1: string;
    orderHash2: string;
}
