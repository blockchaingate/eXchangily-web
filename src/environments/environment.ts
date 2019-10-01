// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
    production: false,
    endpoint: 'https://blockchaingate.com/v2/',
    CoinType: {
        BTC: 1,
        ETH: 60,
        FAB: 1150
    },
    EXGSmartContractAddress: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
    USDTSmartContractAddress: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
    bitcoin_network: Btc.networks.testnet
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone._run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
