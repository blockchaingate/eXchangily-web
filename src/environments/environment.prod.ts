import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
    STRIPE_PUBLIC_KEY: 'pk_test_xVAqsYMxwh3AZfJcYu1hruyE',
    PAYPAL_CLIENT_ID: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x',
    baseUrl: 'https://exchangily.com',
    url: 'https://kanbanprod.fabcoinapi.com/',
    tmpUrl: 'http://13.124.235.105:3000/', // replace this url once the temp api is deployed    
    version: 0.03,
    campaignId: 1,
    OTC_COMMISSION_RATE: 0.001,
    chains: {
        BTC: {
            network: Btc.networks.bitcoin,
            satoshisPerBytes: 60,
            bytesPerInput: 152
        },
        ETH: {
            chain: 'mainnet',
            hardfork: 'petersburg',
            gasPrice: 30000000000,
            gasLimit: 100000
        },
        FAB: {
            chain: {
                name: 'mainnet',
                networkId: 0,
                chainId: 0
            },
            satoshisPerBytes: 50,
            bytesPerInput: 152,
            gasPrice: 50,
            gasLimit: 800000
        },
        KANBAN: {
            chain: {
                name: 'mainnet',
                networkId: 211,
                chainId: 211
            },
            gasPrice: 50000000,
            gasLimit: 20000000
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
        },
        BCH: {
            exchangily: 'https://bchprod.fabcoinapi.com/',
        }
        // pricehistory: 'https://fabprod.fabcoinapi.com:3002/klinedata/'
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150,
        BCH: 145
    },
    addresses: {
        smartContract: {
            FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
            EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
            USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            DUSD: '0x46e0021c17d30a2db972ee5719cdc7e829ed9930'
        },
        exchangilyOfficial: [
            { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' },
            { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu' },
            { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z' },
            { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'DUSD', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' }
        ],
        promotionOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
        },
        otcOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
        }
    },
    websockets: {
        allprices: 'wss://kanbanprod.fabcoinapi.com/ws/allprices',
        trades: 'wss://kanbanprod.fabcoinapi.com/ws/trades',
        orders: 'wss://kanbanprod.fabcoinapi.com/ws/orders',
        kline: 'wss://kanbanprod.fabcoinapi.com/ws/ticker'
    },
    minimumWithdraw: {
        EXG: 50,
        BTC: 0.01,
        FAB: 50,
        ETH: 0.1,
        USDT: 20,
        DUSD: 20
    },
    PaymentMethod: {
        ETransfer: {
            AccountName: 'Exchangily',
            Email: 'info@exchangily.com'
        },
        Wechat: 'exchangily',
        Alipay: 'info@exchangily.com',
        DirectTransfer: {
            BankName: '招商银行',
            AccountName: 'Exchangily',
            Account: '88884556555433234455'
        }
    }
};
