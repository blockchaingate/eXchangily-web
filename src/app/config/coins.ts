import {Price, Coin } from '../interfaces/kanban.interface';

export const coin_list: Coin[] = [
    { id: 0, name: '', icon: '' },
    { id: 1, name: 'USDT', icon: '' },
    { id: 2, name: 'BTC', icon: '' },
    { id: 3, name: 'ETH', icon: '' },
    { id: 4, name: 'FAB', icon: '' },
    { id: 5, name: 'EXG', icon: '' },
    { id: 6, name: 'DUSD', icon: ''}
];

export const price_list: Price[] = [
    { id: 0, coin_id: 5, base_id: 6, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/DUSD' },
    { id: 1, coin_id: 4, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/USDT' },
    { id: 2, coin_id: 2, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BTC/USDT' },
    { id: 3, coin_id: 5, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/USDT' },
    { id: 4, coin_id: 3, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/USDT' },
    { id: 5, coin_id: 4, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/BTC' },
    { id: 6, coin_id: 5, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/BTC' },
    { id: 7, coin_id: 3, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/BTC' },
    { id: 8, coin_id: 4, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/ETH' },
    { id: 9, coin_id: 5, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/ETH' },
    { id: 10, coin_id: 4, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/EXG' }
];
