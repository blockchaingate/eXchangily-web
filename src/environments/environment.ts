// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
    production: false,
    version: 0.03,
    chains: {
        BTC: {
            network: Btc.networks.testnet,
            satoshisPerBytes: 300,
            bytesPerInput: 150
        },
        ETH: {
            chain: 'ropsten', 
            hardfork: 'byzantium',
            gasPrice: 6000000000,
            gasLimit: 100000
        },
        FAB: {
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212                
            },
            satoshisPerBytes: 300,
            bytesPerInput: 150,
            gasPrice: 50,
            gasLimit: 800000            
        },
        KANBAN: {
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212                
            },
            gasPrice: 8000000000,
            gasLimit: 20000000               
        }        
    },
    endpoints: {
        blockchaingate: 'https://blockchaingate.com/v2/',
        // blockchaingate: 'http://localhost:3002/v2/',
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
        FAB: 1150
    },
    addresses: {
        smartContract: {
            FABLOCK: '0xa7d4a4e23bf7dd7a1e03eda9eb7c28a016fd54aa',
            // EXG: '0x311acf4666477a22c2f16c53b88c1734ee227fc6',
            EXG: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
            USDT: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
        },
        exchangilyOfficial: [
            { name: 'EXG', address: '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b'},
            { name: 'FAB', address: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'},
            { name: 'BTC', address: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki'},
            { name: 'ETH', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'},
            { name: 'USDT', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'}
        ]       
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
        USDT: 10
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone._run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
