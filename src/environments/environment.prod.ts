import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
    endpoint: 'https://blockchaingate.com/v2/',
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150
    },
    EXGSmartContractAddress: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
    USDTSmartContractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    bitcoin_network: Btc.networks.bitcoin        
};
