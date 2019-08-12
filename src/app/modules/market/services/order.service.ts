import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { angularMath } from 'angular-ts-math';

import { Order } from '../models/order';
import { OrderBookDisplay, OrderBookItem, TxRecord } from '../models/order-book';

const orderList: Order[] = [
    { pair: 'FAB/ETH', buy: true, price: 0.000500, rate: 1.2, qty: 2.45, filledQty: 1.28, amount: 3972.35, dateCreated: new Date() },
    { pair: 'FAB/USDT', buy: false, price: 0.0685, rate: 1.1, qty: 14.26, filledQty: 11.3234, amount: 4638.21, dateCreated: new Date() },
    { pair: 'EXG/USDT', buy: true, price: 0.12, rate: 1.05, qty: 100.0, filledQty: 0, amount: 3962.45, dateCreated: new Date() },
    { pair: 'FAB/USDT', buy: true, price: 0.072, rate: 0.8, qty: 100000.61, filledQty: 9799, amount: 14532.3, dateCreated: new Date() },
    { pair: 'BTC/USDT', buy: true, price: 5538.72, rate: 1.12, qty: 653, filledQty: 653, amount: 93854.21, dateCreated: new Date() },
    { pair: 'EXG/USDT', buy: false, price: 0.24, rate: 0.99, qty: 986, filledQty: 0, amount: 3632.45, dateCreated: new Date() },
    { pair: 'XRP/USDT', buy: true, price: 0.3034, rate: 1, qty: 19033.05, filledQty: 3785.62, amount: 139623.56, dateCreated: new Date() },
    { pair: 'FAB/BTC', buy: false, price: 0.00012, rate: 0.8, qty: 617, filledQty: 617, amount: 145362.3, dateCreated: new Date() },
    { pair: 'LTC/BTC', buy: false, price: 0.05, rate: 0.7, qty: 2873.8, filledQty: 385, amount: 91023.21, dateCreated: new Date() },
    { pair: 'EXG/BTC', buy: false, price: 0.0024, rate: 1.3, qty: 700, filledQty: 700, amount: 34632.45, dateCreated: new Date() },
    { pair: 'XRP/BTC', buy: false, price: 0.0003, rate: 4.6, qty: 1938.46, filledQty: 0, amount: 13923.56, dateCreated: new Date() },
    { pair: 'FAB/ETH', buy: false, price: 0.000500, rate: 1.0, qty: 2986.45, filledQty: 0, amount: 3972.3, dateCreated: new Date() },
    { pair: 'BTC/ETH', buy: true, price: 366, rate: 1.1, qty: 4539.28, filledQty: 4140, amount: 93854.21, dateCreated: new Date() },
    { pair: 'EXG/ETH', buy: true, price: 0.0002, rate: 1.2, qty: 3333, filledQty: 0, amount: 762.45, dateCreated: new Date() },
    { pair: 'XRP/ETH', buy: true, price: 0.0032, rate: 1.2, qty: 1111.16, filledQty: 0, amount: 139623.56, dateCreated: new Date() },
    { pair: 'FAB/ETH', buy: true, price: 0.000500, rate: 1.2, qty: 2.45, filledQty: 1.28, amount: 3972.35, dateCreated: new Date() },
    { pair: 'FAB/USDT', buy: false, price: 0.0685, rate: 1.1, qty: 14.26, filledQty: 11.3234, amount: 4638.21, dateCreated: new Date() },
    { pair: 'EXG/USDT', buy: true, price: 0.12, rate: 1.05, qty: 100.0, filledQty: 0, amount: 3962.45, dateCreated: new Date() },
    { pair: 'FAB/USDT', buy: true, price: 0.072, rate: 0.8, qty: 100000.61, filledQty: 9799, amount: 14532.3, dateCreated: new Date() },
    { pair: 'BTC/USDT', buy: true, price: 5538.72, rate: 1.12, qty: 653, filledQty: 653, amount: 93854.21, dateCreated: new Date() },
    { pair: 'EXG/USDT', buy: false, price: 0.24, rate: 0.99, qty: 986, filledQty: 0, amount: 3632.45, dateCreated: new Date() },
    { pair: 'LTC/BTC', buy: false, price: 0.05, rate: 0.7, qty: 2873.8, filledQty: 385, amount: 91023.21, dateCreated: new Date() },
    { pair: 'EXG/BTC', buy: false, price: 0.0024, rate: 1.3, qty: 700, filledQty: 700, amount: 34632.45, dateCreated: new Date() },
    { pair: 'XRP/BTC', buy: false, price: 0.0003, rate: 4.6, qty: 1938.46, filledQty: 0, amount: 13923.56, dateCreated: new Date() },
    { pair: 'FAB/ETH', buy: false, price: 0.000500, rate: 1.0, qty: 2986.45, filledQty: 0, amount: 3972.3, dateCreated: new Date() },
    { pair: 'BTC/ETH', buy: true, price: 366, rate: 1.1, qty: 4539.28, filledQty: 4140, amount: 93854.21, dateCreated: new Date() },
    { pair: 'EXG/ETH', buy: true, price: 0.0002, rate: 1.2, qty: 3333, filledQty: 0, amount: 762.45, dateCreated: new Date() },
    { pair: 'XRP/ETH', buy: true, price: 0.0032, rate: 1.2, qty: 1111.16, filledQty: 0, amount: 139623.56, dateCreated: new Date() }
];

const orderBook: OrderBookDisplay = {
    pair: 'FAB/BTC',

    sells: [
        { price: 3899.49, quantity: 0.06 },
        { price: 3898.48, quantity: 0.05 },
        { price: 389.47, quantity: 0.04 },
        {price: 3896.46, quantity: 0.03},
        {price: 3883.566, quantity: 2.0},
        {price: 3875.002, quantity: 5.262},
        { price: 3899.49, quantity: 0.06 },
        { price: 3898.48, quantity: 0.05 },
        { price: 389.47, quantity: 0.04 },
        {price: 3896.46, quantity: 0.03},
        {price: 3883.566, quantity: 2.0},
        {price: 3875.002, quantity: 5.262},
        {price: 3864.324, quantity: 0.793},
        {price: 3859.456, quantity: 1.234},
        {price: 3859.21, quantity: 0.03},
        {price: 3792.87, quantity: 0.1},
        {price: 3792.35, quantity: 2.986},
        {price: 3792.34, quantity: 0.5},
        {price: 3792.33, quantity: 0.001},
    ],

    buys: [
        {price: 3720.222, quantity: 22.123},
        {price: 3719.08, quantity: 0.35},
        {price: 3718.542, quantity: 0.722},
        {price: 3717.231, quantity: 3.85},
        {price: 3716.643, quantity: 123.0},
        {price: 3715.123, quantity: 51.32},
        {price: 3714.452, quantity: 0.47},
        {price: 3713.909, quantity: 6.763},
        {price: 3712.875, quantity: 0.533},
        {price: 3711.04, quantity: 0.0004},
        { price: 3710.09, quantity: 0.0003 },
        { price: 3709.08, quantity: 0.0002 },
        { price: 3708.07, quantity: 0.0001 },
        { price: 3707.06, quantity: 0.0009 },
        { price: 3710.09, quantity: 0.0003 },
        { price: 3709.08, quantity: 0.0002 },
        { price: 3708.07, quantity: 0.0001 },
        { price: 3707.06, quantity: 0.0009 },
    ]
};

const txOrders: TxRecord[] = [
    { price: 3787.7894, quantity: 1.28, time: new Date() },
    { price: 3719.0002, quantity: 5.97, time: new Date() },
    { price: 3769.4054, quantity: 0.53, time: new Date() },
    { price: 3734.5875, quantity: 4.35, time: new Date() },
    { price: 3703.8743, quantity: 89.54, time: new Date() },
    { price: 3727.6975, quantity: 98.44, time: new Date() },
    { price: 3789.8576, quantity: 3.33, time: new Date() },
    { price: 3798.865, quantity: 4.57, time: new Date() },
    {price: 3720.222, quantity: 1.2, time: new Date()},
    {price: 3722.875, quantity: 0.0050, time: new Date()},
    {price: 3894.854, quantity: 1.876, time: new Date()},
    {price: 3885.6543, quantity: 1.54, time: new Date()},
    {price: 3854.7347, quantity: 0.01, time: new Date()},
    {price: 3786.4302, quantity: 0.005, time: new Date()},
    {price: 3694.4324, quantity: 56.00, time: new Date()},
    {price: 3976.6453, quantity: 27, time: new Date()},
    {price: 3564.2743, quantity: 1.2, time: new Date()},
    {price: 3098.4224, quantity: 3.2, time: new Date()},
    {price: 3754.7654, quantity: 6.7, time: new Date()},
    {price: 3787.7894, quantity: 1.28, time: new Date()},
    {price: 3719.0002, quantity: 5.97, time: new Date()},
    {price: 3769.4054, quantity: 0.53, time: new Date()},
    {price: 3734.5875, quantity: 4.35, time: new Date()},
    {price: 3703.8743, quantity: 89.54, time: new Date()},
    {price: 3727.6975, quantity: 98.44, time: new Date()},
    {price: 3789.8576, quantity: 3.33, time: new Date()},
    {price: 3798.865, quantity: 4.57, time: new Date()},
    {price: 3769.4054, quantity: 0.53, time: new Date()},
    {price: 3734.5875, quantity: 4.35, time: new Date()},
    {price: 3703.8743, quantity: 89.54, time: new Date()},
    {price: 3727.6975, quantity: 98.44, time: new Date()},
    {price: 3754.7654, quantity: 6.7, time: new Date()},
];

@Injectable()
export class OrderService {
    constructor(private http: HttpClient) {
    }

    getOrders() {
        return orderList;
    }

    getBuyList(pair: string) {
        let total = 0;
        orderBook.buys.forEach( (buy: OrderBookItem, ind: number, obItems: OrderBookItem[]) => {
            total += buy.quantity;
            buy.acumulate = +angularMath.getNumberWithDecimals(total, 4); 
        });

        return orderBook.buys;
    }

    getSellList(pair: string) {
        let total = 0;
        orderBook.sells.reverse().forEach( (sell: OrderBookItem, ind: number, obItems: OrderBookItem[]) => {
            total += sell.quantity;
            sell.acumulate = +angularMath.getNumberWithDecimals(total, 4);  
        });

        return orderBook.sells.reverse();
    }

    getTxRecords(pair: string) {
        return txOrders;
    }
}
