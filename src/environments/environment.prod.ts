import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
    chains: {
        BTC: {
            network: Btc.networks.bitcoin
        },
        ETH: {
            chain: 'mainnet',
            hardfork: 'petersburg',
            web3Provider: 'https://mainnet.infura.io/v3/6c5bdfe73ef54bbab0accf87a6b4b0ef'
        },
        FAB: {
            chain: {
                name: 'mainnet',
                networkId: 0,
                chainId: 0
            }
        }
    },
    endpoints: {
        blockchaingate: 'https://blockchaingate.com/v2/',
        coingecko: 'https://api.coingecko.com/',
        kanban: 'https://kanbanprod.fabcoinapi.com/',
        BTC: {
            exchangily: 'https://btcprod.fabcoinapi.com/'
        },
        FAB: {
            exchangily: 'https://fabprod.fabcoinapi.com/'
        },
        ETH: {
            exchangily: 'https://ethprod.fabcoinapi.com/',
        }
        // pricehistory: 'https://fabprod.fabcoinapi.com:3002/klinedata/'
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150
    },
    addresses: {
        smartContract: {
            FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
            EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
            USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        },
        exchangilyOfficial: [
            {name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931'},
            { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu'},
            { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z'},
            {name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06'},
            {name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06'}
        ],
    },
    websockets: {
        allprices: 'wss://fabprod.fabcoinapi.com:3002/ws/allprices',
        trades: 'wss://fabprod.fabcoinapi.com:3002/ws/trades',
        orders: 'wss://fabprod.fabcoinapi.com:3002/ws/orders',
        kline: 'ws://18.223.17.4:3002/ws/ticker'
    }  
};
