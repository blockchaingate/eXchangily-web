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
        },
        DOGE: {
            exchangily: 'https://dogeprod.fabcoinapi.com/',
        },
        LTC: {
            exchangily: 'https://ltcprod.fabcoinapi.com/',
        }
        // pricehistory: 'https://fabprod.fabcoinapi.com:3002/klinedata/'
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150,
        BCH: 145,
        LTC: 2,
        DOGE: 3
    }, 
    addresses: {
        smartContract: {
            FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
            EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
            USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            DUSD: '0x46e0021c17d30a2db972ee5719cdc7e829ed9930',
            BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
            INB: '0x17aa18a4b64a55abed7fa543f2ba4e91f2dce482',
            REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
            HOT: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
            CEL: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
            MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            IOST: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
            MANA: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
            FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
            WAX: '0x39bb259f66e1c59d5abef88375979b4d20d98022',
            ELF: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
            GNO: '0x6810e776880c02933d47db1b9fc05908e5386b96', 
            POWR: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
            WINGS: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
            MTL: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
            KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
            MHC: '0xEaB35Bd0533895856f200c99F693b2EC511BFfeE', //??
            GVT: '0x103c3A209da59d3E7C4A89307e66521e081CFDF0'
        },
        /*
        exchangilyOfficial: [
            { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' },
            { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu' },
            { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z' },
            { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'DUSD', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' }
        ],
        */
       exchangilyOfficial: {
        EXG: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931',
        FAB: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu',
        BTC: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z',
        ETH: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06',
        USDT: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06',
        DUSD: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931'
       },
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
