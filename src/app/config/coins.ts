import {Price, Coin } from '../interfaces/kanban.interface';

export const coin_list: Coin[] = [
    { id: 196609, name: 'USDT', icon: '' },
    { id: 65536, name: 'BTC', icon: '' },
    { id: 196608, name: 'ETH', icon: '' },
    { id: 131072, name: 'FAB', icon: '' },
    { id: 131073, name: 'EXG', icon: '' },
    { id: 131074, name: 'DUSD', icon: ''},
    { id: 262144, name: 'BCH', icon: ''},
    { id: 327680, name: 'LTC', icon: ''},
    { id: 393216, name: 'DOGE', icon: ''},
    //{ id: 10, name: 'BNB', icon: ''},
    { id: 196610, name: 'INB', icon: ''},
    { id: 196611, name: 'HOT', icon: ''},
    { id: 196612, name: 'CEL', icon: ''},
    { id: 196613, name: 'MATIC', icon: ''},
    { id: 196614, name: 'IOST', icon: ''},
    { id: 196615, name: 'MANA', icon: ''},
    { id: 196616, name: 'WAX', icon: ''},
    { id: 196617, name: 'ELF', icon: ''},
    { id: 196618, name: 'GNO', icon: ''},
    { id: 196619, name: 'POWR', icon: ''},
    { id: 196620, name: 'WINGS', icon: ''},
    { id: 196621, name: 'MTL', icon: ''},
    { id: 196622, name: 'KNC', icon: ''},
    { id: 196623, name: 'GVT', icon: ''},
    { id: 196624, name: 'REP', icon: ''},
    { id: 196625, name: 'FUN', icon: ''},
    { id: 196626, name: 'DRGN', icon: ''},
    { id: 196627, name: 'NVZN', icon: ''},
    { id: 131075, name: 'CNB', icon: ''},
    { id: 458752, name: 'TRX', icon: ''},
    { id: 458753, name: 'USDTX', icon: ''}
    //REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    //FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
    //MHC: '0xEaB35Bd0533895856f200c99F693b2EC511BFfeE', //?? 
];

export const price_list: Price[] = [
    
    { id: 0, coin_id: 131073, base_id: 131074, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/DUSD' },
    { id: 1, coin_id: 131072, base_id: 131074, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/DUSD' },
    { id: 2, coin_id: 131072, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/USDT' },
    { id: 3, coin_id: 65536, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BTC/USDT' },
    { id: 4, coin_id: 131073, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/USDT' },
    { id: 5, coin_id: 196608, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/USDT' },
    { id: 6, coin_id: 131072, base_id: 65536, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/BTC' },
    { id: 7, coin_id: 131073, base_id: 65536, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/BTC' },
    { id: 8, coin_id: 196608, base_id: 65536, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/BTC' },
    { id: 9, coin_id: 131072, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/ETH' },
    { id: 10, coin_id: 131073, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/ETH' },
    { id: 11, coin_id: 131072, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/EXG' },

    { id: 12, coin_id: 262144, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/EXG' },
    { id: 13, coin_id: 262144, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/USDT' },
    { id: 14, coin_id: 262144, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/ETH' },

    { id: 15, coin_id: 327680, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/EXG' },
    { id: 16, coin_id: 327680, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/USDT' },
    { id: 17, coin_id: 327680, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/ETH' },

    { id: 18, coin_id: 393216, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/EXG' },
    { id: 19, coin_id: 393216, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/USDT' },
    { id: 20, coin_id: 393216, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/ETH' },

   
    { id: 21, coin_id: 196610, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/EXG' },
    { id: 22, coin_id: 196610, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/USDT' },
    { id: 23, coin_id: 196610, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/ETH' },

    { id: 24, coin_id: 196611, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/EXG' },
    { id: 25, coin_id: 196611, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/USDT' },
    { id: 26, coin_id: 196611, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/ETH' },

    { id: 27, coin_id: 196612, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/EXG' },
    { id: 28, coin_id: 196612, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/USDT' },
    { id: 29, coin_id: 196612, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/ETH' },

    { id: 30, coin_id: 196613, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/EXG' },
    { id: 31, coin_id: 196613, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/USDT' },
    { id: 32, coin_id: 196613, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/ETH' },

    { id: 33, coin_id: 196614, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/EXG' },
    { id: 34, coin_id: 196614, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/USDT' },
    { id: 35, coin_id: 196614, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/ETH' },

    { id: 36, coin_id: 196615, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/EXG' },
    { id: 37, coin_id: 196615, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/USDT' },
    { id: 38, coin_id: 196615, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/ETH' },

    { id: 39, coin_id: 196616, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/EXG' },
    { id: 40, coin_id: 196616, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/USDT' },
    { id: 41, coin_id: 196616, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/ETH' },

    { id: 42, coin_id: 196617, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/EXG' },
    { id: 43, coin_id: 196617, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/USDT' },
    { id: 44, coin_id: 196617, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/ETH' },

    { id: 45, coin_id: 196618, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/EXG' },
    { id: 46, coin_id: 196618, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/USDT' },
    { id: 47, coin_id: 196618, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/ETH' },

    { id: 48, coin_id: 196619, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/EXG' },
    { id: 49, coin_id: 196619, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/USDT' },
    { id: 50, coin_id: 196619, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/ETH' },

    { id: 51, coin_id: 196620, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/EXG' },
    { id: 52, coin_id: 196620, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/USDT' },
    { id: 53, coin_id: 196620, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/ETH' },

    { id: 54, coin_id: 196621, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/EXG' },
    { id: 55, coin_id: 196621, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/USDT' },
    { id: 56, coin_id: 196621, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/ETH' },

    { id: 57, coin_id: 196622, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/EXG' },
    { id: 58, coin_id: 196622, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/USDT' },
    { id: 59, coin_id: 196622, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/ETH' },

    { id: 60, coin_id: 196623, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/EXG' },
    { id: 61, coin_id: 196623, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/USDT' },
    { id: 62, coin_id: 196623, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/ETH' },

    { id: 63, coin_id: 196624, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/EXG' },
    { id: 64, coin_id: 196624, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/USDT' },
    { id: 65, coin_id: 196624, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/ETH' },

    { id: 66, coin_id: 196625, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/EXG' },
    { id: 67, coin_id: 196625, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/USDT' },
    { id: 68, coin_id: 196625, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/ETH' },

    { id: 69, coin_id: 196626, base_id: 131073, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/EXG' },
    { id: 70, coin_id: 196626, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/USDT' },
    { id: 71, coin_id: 196626, base_id: 196608, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/ETH' },
    { id: 72, coin_id: 196627, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'NVZN/USDT' },
    { id: 73, coin_id: 131075, base_id: 196609, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CNB/USDT' }

];
