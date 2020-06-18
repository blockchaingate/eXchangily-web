import {Price, Coin } from '../interfaces/kanban.interface';

export const coin_list: Coin[] = [
    { id: 0, name: '', icon: '' },
    { id: 1, name: 'USDT', icon: '' },
    { id: 2, name: 'BTC', icon: '' },
    { id: 3, name: 'ETH', icon: '' },
    { id: 4, name: 'FAB', icon: '' },
    { id: 5, name: 'EXG', icon: '' },
    { id: 6, name: 'DUSD', icon: ''},
    { id: 7, name: 'BCH', icon: ''},
    { id: 8, name: 'LTC', icon: ''},
    { id: 9, name: 'DOGE', icon: ''},
    { id: 10, name: 'BNB', icon: ''},
    { id: 11, name: 'INB', icon: ''},
    { id: 12, name: 'HOT', icon: ''},
    { id: 13, name: 'CEL', icon: ''},
    { id: 14, name: 'MATIC', icon: ''},
    { id: 15, name: 'IOST', icon: ''},
    { id: 16, name: 'MANA', icon: ''},
    { id: 17, name: 'WAX', icon: ''},
    { id: 18, name: 'ELF', icon: ''},
    { id: 19, name: 'GNO', icon: ''},
    { id: 20, name: 'POWR', icon: ''},
    { id: 21, name: 'WINGS', icon: ''},
    { id: 22, name: 'MTL', icon: ''},
    { id: 23, name: 'KNC', icon: ''},
    { id: 24, name: 'GVT', icon: ''},
    { id: 25, name: 'REP', icon: ''},
    { id: 26, name: 'FUN', icon: ''},
    { id: 27, name: 'DRGN', icon: ''}
    //REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    //FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
    //MHC: '0xEaB35Bd0533895856f200c99F693b2EC511BFfeE', //?? 
];

export const price_list: Price[] = [
    { id: 0, coin_id: 5, base_id: 6, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/DUSD' },
    { id: 1, coin_id: 4, base_id: 6, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/DUSD' },
    { id: 2, coin_id: 4, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/USDT' },
    { id: 3, coin_id: 2, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BTC/USDT' },
    { id: 4, coin_id: 5, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/USDT' },
    { id: 5, coin_id: 3, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/USDT' },
    { id: 6, coin_id: 4, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/BTC' },
    { id: 7, coin_id: 5, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/BTC' },
    { id: 8, coin_id: 3, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/BTC' },
    { id: 9, coin_id: 4, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/ETH' },
    { id: 10, coin_id: 5, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/ETH' },
    { id: 11, coin_id: 4, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/EXG' },

    { id: 12, coin_id: 7, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/EXG' },
    { id: 13, coin_id: 7, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/USDT' },
    { id: 14, coin_id: 7, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/ETH' },

    { id: 15, coin_id: 8, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/EXG' },
    { id: 16, coin_id: 8, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/USDT' },
    { id: 17, coin_id: 8, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/ETH' },

    { id: 18, coin_id: 9, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/EXG' },
    { id: 19, coin_id: 9, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/USDT' },
    { id: 20, coin_id: 9, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/ETH' },

    { id: 21, coin_id: 10, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BNB/EXG' },
    { id: 22, coin_id: 10, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BNB/USDT' },
    { id: 23, coin_id: 10, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BNB/ETH' },

    { id: 24, coin_id: 11, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/EXG' },
    { id: 25, coin_id: 11, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/USDT' },
    { id: 26, coin_id: 11, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/ETH' },

    { id: 27, coin_id: 12, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/EXG' },
    { id: 28, coin_id: 12, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/USDT' },
    { id: 29, coin_id: 12, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/ETH' },

    { id: 30, coin_id: 13, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/EXG' },
    { id: 31, coin_id: 13, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/USDT' },
    { id: 32, coin_id: 13, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/ETH' },

    { id: 33, coin_id: 14, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/EXG' },
    { id: 34, coin_id: 14, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/USDT' },
    { id: 35, coin_id: 14, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/ETH' },

    { id: 36, coin_id: 15, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/EXG' },
    { id: 37, coin_id: 15, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/USDT' },
    { id: 38, coin_id: 15, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/ETH' },

    { id: 39, coin_id: 16, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/EXG' },
    { id: 40, coin_id: 16, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/USDT' },
    { id: 41, coin_id: 16, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/ETH' },

    { id: 42, coin_id: 17, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/EXG' },
    { id: 43, coin_id: 17, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/USDT' },
    { id: 44, coin_id: 17, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/ETH' },

    { id: 45, coin_id: 18, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/EXG' },
    { id: 46, coin_id: 18, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/USDT' },
    { id: 47, coin_id: 18, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/ETH' },

    { id: 48, coin_id: 19, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/EXG' },
    { id: 49, coin_id: 19, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/USDT' },
    { id: 50, coin_id: 19, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/ETH' },

    { id: 51, coin_id: 20, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/EXG' },
    { id: 52, coin_id: 20, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/USDT' },
    { id: 53, coin_id: 20, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/ETH' },

    { id: 54, coin_id: 21, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/EXG' },
    { id: 55, coin_id: 21, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/USDT' },
    { id: 56, coin_id: 21, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/ETH' },

    { id: 57, coin_id: 22, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/EXG' },
    { id: 58, coin_id: 22, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/USDT' },
    { id: 59, coin_id: 22, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/ETH' },

    { id: 60, coin_id: 23, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/EXG' },
    { id: 61, coin_id: 23, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/USDT' },
    { id: 62, coin_id: 23, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/ETH' },

    { id: 63, coin_id: 24, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/EXG' },
    { id: 64, coin_id: 24, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/USDT' },
    { id: 65, coin_id: 24, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/ETH' },

    { id: 66, coin_id: 25, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/EXG' },
    { id: 67, coin_id: 25, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/USDT' },
    { id: 68, coin_id: 25, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/ETH' },

    { id: 69, coin_id: 26, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/EXG' },
    { id: 70, coin_id: 26, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/USDT' },
    { id: 71, coin_id: 26, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/ETH' },

    { id: 72, coin_id: 27, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/EXG' },
    { id: 73, coin_id: 27, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/USDT' },
    { id: 74, coin_id: 27, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/ETH' }
];
