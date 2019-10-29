import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
    chains: {
        BTC: {
            network: Btc.networks.bitcoin
        },
        ETH: {
            chain: 'mainnet', 
            hardfork: 'petersburg',
            web3Provider: 'https://mainnet.infura.io/v3/6c5bdfe73ef54bbab0accf87a6b4b0ef'
        },
        FAB: {
            chain: {
                name: 'mainnet',
                networkId: 0,
                chainId: 0                
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
        }        
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150
    },
    addresses: {
        smartContract: {
            EXG: '0x60bb036e5458efa9cf322678758cfa9c6436c47a',
            USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
