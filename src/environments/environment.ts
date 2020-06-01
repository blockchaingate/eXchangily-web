// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
    production: false,
    version: 0.03,
    STRIPE_PUBLIC_KEY: 'pk_test_xVAqsYMxwh3AZfJcYu1hruyE',
    PAYPAL_CLIENT_ID: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x',
    url:"https://kanbantest.fabcoinapi.com/",
    tmpUrl:  "http://13.124.235.105:3000/",    
    baseUrl: 'https://exchangily.net',
    campaignId: 1,
    OTC_COMMISSION_RATE: 0.001,
    chains: {
        BTC: {
            network: Btc.networks.testnet,
            satoshisPerBytes: 50,
            bytesPerInput: 148
        },
        ETH: {
            chain: 'ropsten', 
            hardfork: 'byzantium',
            gasPrice: 10000000000,
            gasLimit: 100000
        },
        FAB: {
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212                
            },
            satoshisPerBytes: 50,
            bytesPerInput: 148,
            gasPrice: 50,
            gasLimit: 800000            
        },
        KANBAN: {
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212                
            },
            gasPrice: 50000000,
            gasLimit: 20000000              
        }        
    },
    endpoints: {
        // blockchaingate: 'http://localhost:3002/v2/',
        blockchaingate: 'https://test.blockchaingate.com/v2/',
        coingecko: 'https://api.coingecko.com/',
        kanban: 'https://kanbantest.fabcoinapi.com/',
        BTC: {
            exchangily: 'https://btctest.fabcoinapi.com/'
        },
        FAB: {
            exchangily: 'https://fabtest.fabcoinapi.com/'
        },
        ETH: {
            exchangily: 'https://ethtest.fabcoinapi.com/',
            // etherscan: 'https://api-ropsten.etherscan.io/'
        }
        // pricehistory: 'http://18.223.17.4:3002/klinedata/'

    },
    CoinType: {
        BTC: 1,
        ETH: 60,
        FAB: 1150,
        BCH: 145
    },
    addresses: {
        smartContract: {
            FABLOCK: '0xa7d4a4e23bf7dd7a1e03eda9eb7c28a016fd54aa',
            // EXG: '0x311acf4666477a22c2f16c53b88c1734ee227fc6',
            EXG: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
            USDT: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
            DUSD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed'
        },
        exchangilyOfficial: [
            { name: 'EXG', address: '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b'},
            { name: 'FAB', address: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'},
            { name: 'BTC', address: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki'},
            { name: 'ETH', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'},
            { name: 'USDT', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'},
            { name: 'DUSD', address: '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b'}
        ],
        promotionOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
        },
        otcOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
        }       
    },
    websockets: {
        allprices: 'wss://kanbantest.fabcoinapi.com/ws/allprices',
        trades: 'wss://kanbantest.fabcoinapi.com/ws/trades',
        orders: 'wss://kanbantest.fabcoinapi.com/ws/orders',
        kline: 'wss://kanbantest.fabcoinapi.com/ws/ticker' 
    },
    minimumWithdraw: {
        EXG: 10,
        BTC: 0.002,
        FAB: 0.005,
        ETH: 0.01,
        USDT: 10,
        DUSD: 10
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
            AccountName : 'Exchangily',
            Account: '88884556555433234455'
        }
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone._run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
