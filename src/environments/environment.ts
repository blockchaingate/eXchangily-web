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
        coingecko: 'https://api.coingecko.com/',
        kanban: 'http://18.223.17.4:4000/',
        explorer: 'http://169.53.144.184:3000/',
        BTC: {
            exchangily: 'http://18.188.32.168:8000/'
        },
        FAB: {
            exchangily: 'http://52.60.97.159:8000/'
        },
        ETH: {
            exchangily: 'http://3.13.178.231:3000/',
            etherscan: 'https://api-ropsten.etherscan.io/'
        }
    },
    CoinType: {
        BTC: 1,
        ETH: 60,
        FAB: 1150
    },
    addresses: {
        smartContract: {
            EXG: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
            USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            SCAR: '',
            EXCHANGILY: ''
        },
        exchangilyOfficial: [
            {name: 'EXG', address: '0x64161c648e16fb1e25a31abc9b27c35d02fd36ff'},
            {name: 'FAB', address: 'ms5Ddek7XudLoRtzeNyFsThMCdMkjZh94T'},
            {name: 'BTC', address: 'mmSziWwxpTsoHDVcP9yo3vBmA9RCJpsES9'},
            {name: 'ETH', address: '0xb2e8bac11afe8762fb6a1ab56c36084d2fbbd48a'},
            {name: 'USDT', address: '0x7ece14d72a8600d29f486eab1377e33c3266b001'}
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
