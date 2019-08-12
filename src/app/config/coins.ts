import {Price, Coin, OfficialAddress} from '../interfaces/kanban.interface';

export const offical_addresses: OfficialAddress[] = [
    {name: 'EXG', address: '0x64161c648e16fb1e25a31abc9b27c35d02fd36ff'},
    {name: 'FAB', address: 'ms5Ddek7XudLoRtzeNyFsThMCdMkjZh94T'},
    {name: 'BTC', address: 'mmSziWwxpTsoHDVcP9yo3vBmA9RCJpsES9'},
    {name: 'ETH', address: '0xb2e8bac11afe8762fb6a1ab56c36084d2fbbd48a'},
    {name: 'USDT', address: '0x7ece14d72a8600d29f486eab1377e33c3266b001'}
];

export const coin_list: Coin[] = [
    { id: 0, name: 'USDT', icon: '' },
    { id: 1, name: 'BTC', icon: '' },
    { id: 2, name: 'ETH', icon: '' },
    { id: 3, name: 'FAB', icon: '' },
    { id: 4, name: 'EXG', icon: '' },
];

export const price_list: Price[] = [
    { id: 0, coin_id: 3, base_id: 0, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 1, coin_id: 1, base_id: 0, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 2, coin_id: 4, base_id: 0, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 3, coin_id: 2, base_id: 0, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 4, coin_id: 3, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 5, coin_id: 4, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 6, coin_id: 2, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 7, coin_id: 3, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 8, coin_id: 4, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 },
    { id: 9, coin_id: 4, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, favorite: 0 }
];
