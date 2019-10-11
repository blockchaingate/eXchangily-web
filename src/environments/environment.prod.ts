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
        kanban: 'http://18.223.17.4:4000/',
        BTC: {
            exchangily: 'http://18.188.32.168:8000/'
        },
        FAB: {
            exchangily: 'http://52.60.97.159:8000/'
        },                
        ETH: {
            exchangily: 'http://35.183.164.127:3000/',
            etherscan: 'https://api.etherscan.io/'
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
            {name: 'EXG', address: '0x9f35a499924ab58ddeed21462f3b788c25272e1b'},
            {name: 'FAB', address: 'mv2mzjWtGqXTre9JwBxjdKbv3hDZ1FkVrr'},
            {name: 'BTC', address: 'n4KYqpYWQpVpinReGxQcoL62oyEs1ckVGu'},
            {name: 'ETH', address: '0xcfa376028a27dd25dc8f71468587ec81d5c383e4'},
            {name: 'USDT', address: '0xcfa376028a27dd25dc8f71468587ec81d5c383e4'}
        ],        
    }  
};
