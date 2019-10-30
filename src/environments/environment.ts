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
            EXG: '60bb036e5458efa9cf322678758cfa9c6436c47a',
            USDT: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            SCAR: '',
            EXCHANGILY: ''
        },
        exchangilyOfficial: [
            { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931'},
            { name: 'FAB', address: 'mutBzWDtGoHV92ksuqn5c9UExPcgzz6d9x'},
            { name: 'BTC', address: 'mrqdPmwa5YjCxQP5fgL2fTcomM9qYyyf2B'},
            { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06'},
            { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06'}
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
