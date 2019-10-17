import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
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
        kanban: 'https://kanbanprod.fabcoinapi.com/',
        BTC: {
            exchangily: 'https://btcprod.fabcoinapi.com/'
        },
        FAB: {
            exchangily: 'https://fabprod.fabcoinapi.com/'
        },                
        ETH: {
            exchangily: 'https://ethprod.fabcoinapi.com/',
            //etherscan: 'https://api.etherscan.io/'
        }        
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150
    },
    addresses: {
        smartContract: {
            EXG: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
            USDT: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
            SCAR: '',
            EXCHANGILY: ''
        },
        exchangilyOfficial: [
            {name: 'EXG', address: '0xdcd0f23125f74ef621dfa3310625f8af0dcd971b'},
            {name: 'FAB', address: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'},
            {name: 'BTC', address: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki'},
            {name: 'ETH', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'},
            {name: 'USDT', address: '0x02c55515e62a0b25d2447c6d70369186b8f10359'}
        ],        
    }  
};
