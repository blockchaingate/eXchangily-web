import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
    version: 0.03,
    campaignId: 1,
    chains: {
        BTC: {
            network: Btc.networks.bitcoin,
            satoshisPerBytes: 50,
            bytesPerInput: 152
        },
        ETH: {
            chain: 'mainnet',
            hardfork: 'petersburg',
            gasPrice: 6000000000,
            gasLimit: 100000
        },
        FAB: {
            chain: {
                name: 'mainnet',
                networkId: 0,
                chainId: 0
            },
            satoshisPerBytes: 50,
            bytesPerInput: 152,
            gasPrice: 50,
            gasLimit: 800000
        },
        KANBAN: {
            chain: {
                name: 'mainnet',
                networkId: 211,
                chainId: 211                
            },
            gasPrice: 50000000,
            gasLimit: 20000000    
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
        // pricehistory: 'https://fabprod.fabcoinapi.com:3002/klinedata/'
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        FAB: 1150
    },
    addresses: {
        smartContract: {
            FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
            EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
            USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            DUSD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed'
        },
        exchangilyOfficial: [
            { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' },
            { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu' },
            { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z' },
            { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'DUSD', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' }
        ],
        promotionOfficial: {
            USDT: '',
            DUSD: '',
            BTC: '',
            ETH: '',
            FAB: ''
        }   
    },
    websockets: {
        allprices: 'wss://kanbanprod.fabcoinapi.com/ws/allprices',
        trades: 'wss://kanbanprod.fabcoinapi.com/ws/trades',
        orders: 'wss://kanbanprod.fabcoinapi.com/ws/orders',
        kline: 'wss://kanbanprod.fabcoinapi.com/ws/ticker'
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
