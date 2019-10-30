// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
    production: false,
    chains: {
        BTC: {
            network: Btc.networks.testnet
        },
        ETH: {
            chain: 'ropsten', 
            hardfork: 'byzantium',
            web3Provider: 'https://ropsten.infura.io/v3/6c5bdfe73ef54bbab0accf87a6b4b0ef'
        },
        FAB: {
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212                
            }
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
    },
    CoinType: {
        BTC: 1,
        ETH: 60,
        FAB: 1150
    },
    addresses: {
        smartContract: {
            EXG: '0x311acf4666477a22c2f16c53b88c1734ee227fc6',
            USDT: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            SCAR: '',
            EXCHANGILY: ''
        },
        exchangilyOfficial: [
            { name: 'EXG', address: '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b'},
            { name: 'FAB', address: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'},
            { name: 'BTC', address: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki'},
            { name: 'ETH', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'},
            { name: 'USDT', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'}
        ]       
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone._run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
