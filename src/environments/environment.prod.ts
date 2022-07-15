import * as Btc from 'bitcoinjs-lib';
export const environment = {
    production: true,
    SQUARE_APP_ID: {
        CAD: 'sandbox-sq0idb-UUMNZpqOLdU5yOO9Y6AKyg', 
        USD: 'sq0idp-5W-PIrJbalW5u5KbeEA-Gw'
    },
    IssueTokenReceipt: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu',
    EPAY_API: 'https://api.epay.com/paymentApi',
    STRIPE_PUBLIC_KEY: 'pk_test_xVAqsYMxwh3AZfJcYu1hruyE',
    PAYPAL_CLIENT_ID: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x',
    baseUrl: 'https://exchangily.com',
    url: 'https://api.exchangily.com/',
    version: '2.2.13',
    campaignId: 1,
    PUBLIC_KEY: '8aff99f9727143fccd28e62df14e4e67305faa70d19b4cb0b9d4cde18ea3cd23c8e58bda3c26e10813aaa6020f3d07a3d9f83a9062cfe662a600949325378b99',
    OTC_COMMISSION_RATE: 0,
    chains: {
        BTC: {
            network: Btc.networks.bitcoin,
            satoshisPerBytes: 90,
            bytesPerInput: 152
        },
        DOGE: {
            network: {
                messagePrefix: '\u0019Dogecoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                  public: 0x02facafd,
                  private: 0x02fac398,
                },
                pubKeyHash: 0x1e,
                scriptHash: 0x16,
                wif: 0x9e,
            },            
            satoshisPerBytes: 1500000,
            bytesPerInput: 148
        },

        LTC: {
            network: {
                messagePrefix: '\u0019Litecoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                  public: 0x019da462,
                  private: 0x019d9cfe,
                },
                pubKeyHash: 0x30,
                scriptHash: 0x32,
                wif: 0xb0,
            },            
            satoshisPerBytes: 150,
            bytesPerInput: 148
        },  
        BCH: {
            network: {
                messagePrefix: '\u0018Bitcoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4,
                },
                pubKeyHash: 28,
                scriptHash: 40,
                wif: 0x80,
            },            
            satoshisPerBytes: 9,
            bytesPerInput: 148
        },               
        ETH: {
            chain: 'mainnet',
            hardfork: 'petersburg',
            gasPrice: 90,
            gasPriceMax: 200,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        BNB: {
            chain: {
                name: 'mainnet',
                networkId: 56,
                chainId: 56
            },
            rpcEndpoint: 'https://bsc-dataseed.binance.org',
            hardfork: 'petersburg',
            gasPrice: 5,
            gasPriceMax: 200,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        MATIC: {
            chain: {
                name: 'mainnet',
                networkId: 137,
                chainId: 137
            },
            rpcEndpoint: 'https://polygon-rpc.com',
            hardfork: 'petersburg',
            gasPrice: 5,
            gasPriceMax: 200,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        HT: {
            chain: {
                name: 'mainnet',
                networkId: 128,
                chainId: 128
            },
            rpcEndpoint: 'https://http-mainnet.hecochain.com/',
            hardfork: 'petersburg',
            gasPrice: 5,
            gasPriceMax: 200,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        FAB: {
            network: Btc.networks.bitcoin,
            chain: {
                name: 'mainnet',
                networkId: 0,
                chainId: 0
            },
            satoshisPerBytes: 100,
            bytesPerInput: 152,
            gasPrice: 40,
            gasLimit: 100000
        },
        KANBAN: {
            chain: {
                name: 'mainnet',
                networkId: 211,
                chainId: 211
            },
            gasPrice: 50000000,
            gasLimit: 20000000
        },
        TRX: {
            network: {
                messagePrefix: '\x15TRON Signed Message:\n'
            },     
            feeLimit: 15000000,
            feeLimitToken: 15000000,                   
            fullNode: 'https://api.trongrid.io',
            solidityNode: 'https://api.trongrid.io',
            eventServer: 'https://api.trongrid.io'          
        }
    },
    endpoints: {
        blockchaingate: 'https://api.blockchaingate.com/v2/',
        coingecko: 'https://api.coingecko.com/',
        kanban: 'https://api.exchangily.com/',
        normal_kanban: 'https://kanbanprod.fabcoinapi.com/',
        BTC: {
            exchangily: 'https://btcprod.fabcoinapi.com/'
        },
        FAB: {
            exchangily: 'https://fabprod.fabcoinapi.com/'
        },
        ETH: {
            exchangily: 'https://ethprod.fabcoinapi.com/',
        },
        BCH: {
            exchangily: 'https://bchprod.fabcoinapi.com/',
        },
        DOGE: {
            exchangily: 'https://dogeprod.fabcoinapi.com/',
        },
        LTC: {
            exchangily: 'https://ltcprod.fabcoinapi.com/',
        }
        // pricehistory: 'https://fabprod.fabcoinapi.com:3002/klinedata/'
    },
    CoinType: {
        BTC: 0,
        ETH: 60,
        BNB: 60,
        HT: 60,
        MATIC: 60,
        FAB: 1150,
        BCH: 145,
        LTC: 2,
        DOGE: 3,
        TRX: 195
    }, 
    addresses: {
        smartContract: {
            FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
            EXG: {
                FAB: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
                ETH: '0xebbe2e94b6efd2a09b707167f796ef2616291438'
            },
            USDT: {
                ETH: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                TRX: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
                BNB: '0x55d398326f99059ff775485246999027b3197955',
                MATIC: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
            },
            IXT: {
                MATIC: '0xe06bd4f5aac8d0aa337d13ec88db6defc6eaeefe'
            },
            USDC: {
                ETH: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                TRX: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'
            },
            FAB: {
                ETH: '0xf2260ed15c59c9437848afed04645044a8d5e270',
                BNB: '0x8ddae5f3e5a5d9eb0509e23259e1948362eb5ca8'
            },
            DSC: {
                FAB: '0x64f1f72543c9d517a4e0bee32a3d11a21dc87de4',
                ETH: '0xe3d64fca00dd7b76b45f4b8425f49f6e6327623d'
            },
            BST: {
                FAB: '0x3e6f8813ab824ac2fea001091fb2ce0365297164',
                ETH: '0x4fe1819daf783a3f3151ea0937090063b85d6122'
            },  
            SEED: {
                FAB: '0xdcc3abba31890d81f450662f9c99de4979073a60'
            },
            FET: {
                FAB: '0xb1c5a4648c9be7f0ca00b559a3325133c2dfdc37'
            },
            GET: {
                FAB: '0xda0f76ec006246654fd2eed060f9f9025c6b3d58'
            },  
            CTG: '0x05c1a1dff47874f49230f31774b1ebe4b8899f68',  
            CABTC: '0x4eeda2159e1a66de4ec1d711d53123eb2ba15e92',        
            DUSD: '0x46e0021c17d30a2db972ee5719cdc7e829ed9930',
            TWBTC: '0xc50389694f222bf95f014e0bdae3f5e3676999fb',
            DCAD: '0x39296a9d1c5019fd64c9ef4cd0e657403bf10405',
            DCNY: '0xcb856b9d1184232a3ec1ae735b39778c6e65a33a',
            DJPY: '0xec794fc70b9db714a4dec2581bce6764b3731a84',
            DGBP: '0xb1c07ddae8f2f449e8896874ac307325c39842d3',
            DEURO: '0xadf9ec6c2f28217c0c8c8a173e0c06c4e6cbe4a1',
            DAUD: '0xbc01e6e46369c6fc61fefa722dd081d1c0f1c096',
            DMYR: '0x2a81b44e3c3d0bd3941c636ae3e945460b7ad49d',
            DKRW: '0x14221b728caab28eea480fb114b1edd36c72ffaf',
            DPHP: '0x4ef2bfe2726b006f6ef85e59555e23c8a7ada071',
            DTHB: '0xaf90bd20af338203e807b63417c40eb3cd45ce2e',
            DTWD: '0x5b98385998bb78fe55b547c2baa1abc4fd31e4e9',
            DSGD: '0xfc32f23a8246d9882149f2aeb2548e9a6da51746',
            DHKD: '0x838eac199995a3252bf513bad4b04741767c4331',
            DINR: '0x16c3f0a2af0f1661c556f6dd9c4c12843ccedf7a',
            DMXN: '0x9b5fe4f9fb3a20d0fc2d2b4533a047994adf51bc',
            DBRL: '0x0e0eab64b2473a0912ff767904cc013402dfc822',
            DNGN: '0xd45948d6cc0450fd97e161fafe973e59a90799c5',
            
            INB: '0x17aa18a4b64a55abed7fa543f2ba4e91f2dce482',
            REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
            HOT: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
            CEL: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
            MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            IOST: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
            MANA: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
            FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
            WAX: '0x39bb259f66e1c59d5abef88375979b4d20d98022',
            ELF: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
            GNO: '0x6810e776880c02933d47db1b9fc05908e5386b96', 
            POWR: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
            WINGS: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
            MTL: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
            KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
            GVT: '0x103c3A209da59d3E7C4A89307e66521e081CFDF0',
            DRGN: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',
            NVZN: '0x99963EE76C886fc43D5063428fF8F926E8A50985',
            CNB: '0xceb9a838c3f3ee6e3168c06734f9188f2693999f',
            CSU: '0x7650987b35272a64934b6d02aad6db5b3bd8d119',

            LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
            UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
            SHIB: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
            CRO: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
            GALA: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA',
            POLY: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
            CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
            SAND: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
            COMP: '0xc00e94cb662c3520282e6f5717214004a7f26888',
            BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
            SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
            CVC: '0x41e5560054824ea6b0732e656e3ad64e20e94e45',
            CELR: '0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
            YFI: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
            SLP: '0x37236cd05b34cc79d3715af2383e96dd7443dcf1'
        },
        /*
        exchangilyOfficial: [
            { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' },
            { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu' },
            { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z' },
            { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
            { name: 'DUSD', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' }
        ],
        */
       exchangilyOfficial: {
        FAB: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
        BTC: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
        ETH: '0x4983f8634255762A18D854790E6d35A522E2633a', 
        BNB: '0x4983f8634255762A18D854790E6d35A522E2633a', 
        MATIC: '0x4983f8634255762A18D854790E6d35A522E2633a', 
        BCH: 'bitcoincash:qznusftmq4cac0fuj6eyke5vv45njxe6eyafcld37l',
        LTC: 'LaX6sfX8RoHbQHNDEBmdzyBMN9vFa95FXL',
        DOGE: 'DLSF9i9weYwpgUrendmuGiHC35HGoHuvR9',   
        TRX: 'TGfvRWxddNoWrghwE5zC1JEcbXyMdPATdo' 
           /*
        EXG: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
        FAB: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
        BTC: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
        ETH: '0x4983f8634255762A18D854790E6d35A522E2633a',
        USDT: '0x4983f8634255762A18D854790E6d35A522E2633a',
        DUSD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
        BCH: 'bitcoincash:qznusftmq4cac0fuj6eyke5vv45njxe6eyafcld37l',
        LTC: 'LaX6sfX8RoHbQHNDEBmdzyBMN9vFa95FXL',
        DOGE: 'DLSF9i9weYwpgUrendmuGiHC35HGoHuvR9',
        INB: '0x4983f8634255762A18D854790E6d35A522E2633a',
        REP: '0x4983f8634255762A18D854790E6d35A522E2633a',
        HOT: '0x4983f8634255762A18D854790E6d35A522E2633a',
        CEL: '0x4983f8634255762A18D854790E6d35A522E2633a',
        MATIC: '0x4983f8634255762A18D854790E6d35A522E2633a',
        IOST: '0x4983f8634255762A18D854790E6d35A522E2633a',
        MANA: '0x4983f8634255762A18D854790E6d35A522E2633a',
        FUN: '0x4983f8634255762A18D854790E6d35A522E2633a',
        WAX: '0x4983f8634255762A18D854790E6d35A522E2633a',
        ELF: '0x4983f8634255762A18D854790E6d35A522E2633a',
        GNO: '0x4983f8634255762A18D854790E6d35A522E2633a', 
        POWR: '0x4983f8634255762A18D854790E6d35A522E2633a',
        WINGS: '0x4983f8634255762A18D854790E6d35A522E2633a',
        MTL: '0x4983f8634255762A18D854790E6d35A522E2633a',
        KNC: '0x4983f8634255762A18D854790E6d35A522E2633a',
        GVT: '0x4983f8634255762A18D854790E6d35A522E2633a',
        DRGN: '0x4983f8634255762A18D854790E6d35A522E2633a',
        NVZN: '0x4983f8634255762A18D854790E6d35A522E2633a',
        CNB: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
        TRX: 'TGfvRWxddNoWrghwE5zC1JEcbXyMdPATdo'
        */
       },
       
        promotionOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
        },
        otcOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
        }
    },
    websockets: {
        allprices: 'wss://kanbanprod.fabcoinapi.com/ws/allprices',
        trades: 'wss://kanbanprod.fabcoinapi.com/ws/trades',
        orders: 'wss://kanbanprod.fabcoinapi.com/ws/orders',
        kline: 'wss://kanbanprod.fabcoinapi.com/ws/ticker'
    },
    minimumWithdraw: {
        EXG: {
            FAB:50,
            ETH: 50
        },
        DSC: {
            FAB: 50,
            ETH: 250
        },
        BST: {
            FAB: 10,
            ETH: 50
        },                
        BTC: 0.01,
        FAB: {
            FAB:50,
            ETH: 100,
            BNB: 2
        },
        ETH: 0.1 * 2,
        USDT: {
            ETH: 20 * 2,
            TRX: 0.2,
            BNB: 2,
            MATIC: 0.1
        },    
        TRX: 0.2,    
        DUSD: 20,
        SEED: 1,
        FET: 100,
        GET: 0.0000001,
        DCAD: 12.68,
        DCNY: 64,
        DJPY: 1100,
        DGBP: 8,
        DEURO: 9,
        DAUD: 14,
        DMYR: 40,
        DKRW: 12000,
        DPHP: 500,
        DTHB: 400,
        DTWD: 280,
        DSGD: 14,
        DHKD: 80,
        DINR: 800,
        DMXN: 200,
        DBRL: 60,
        TWBTC: 1,
        DNGN: 4000,
        IXT: 0.006,
        BCH: 0.002,
        LTC: 0.02,
        DOGE: 20,
        BNB: 0.6 * 2,
        INB: 20 * 2,
        REP: 0.8 * 2,
        HOT: 16000 * 2,
        CEL: 40 * 2,
        MATIC: {
            ETH:500 * 2,
            MATIC: 0.004
        },
        IOST: 2000 * 2,
        MANA: 240 * 2,
        FUN: 3000 * 2,
        WAX: 200 * 2,
        ELF: 100 * 2,
        GNO: 0.4 * 2, 
        POWR: 100 * 2,
        WINGS: 200 * 2,
        MTL: 40 * 2,
        KNC: 10 * 2,
        GVT: 10 * 2,
        DRGN: 100 * 2,
        NVZN: 100 * 2,
        CNB: 100 * 2,
        LINK: 1, 
        UNI: 1, 
        SHIB: 2000000, 
        CRO: 120, 
        GALA: 200, 
        POLY: 20, 
        CRV: 10, 
        SAND: 20, 
        COMP: 0.1, 
        BAT: 30, 
        SUSHI: 2, 
        CVC: 40, 
        CELR: 140, 
        YFI: 0.001, 
        SLP: 240
    },
    depositMinimumConfirmations: {
        EXG: 12,
        BTC: 2,
        FAB: 12,
        ETH: 20,
        USDT: 20,
        DUSD: 12,
        DCAD: 12,
        DCNY: 12,
        DJPY: 12,
        DGBP: 12,
        DEURO: 12,
        DAUD: 12,
        DMYR: 12,
        DKRW: 12,
        DPHP: 12,
        DTHB: 12,
        DTWD: 12,
        DSGD: 12,
        DHKD: 12,
        DINR: 12,
        DMXN: 12,
        SEED: 12,
        FET: 12,
        GET: 12,
        DBRL: 12,
        DNGN: 12,  
        TWBTC: 12,     
        BCH: 2,
        LTC: 8,
        DOGE: 20,
        BNB: 20,
        INB: 20,
        REP: 20,
        HOT: 20,
        CEL: 20,
        MATIC: 20,
        IOST: 20,
        MANA: 20,
        FUN: 20,
        WAX: 20,
        ELF: 20,
        GNO: 20,
        POWR: 20,
        WINGS: 20,
        MTL: 20,
        KNC: 20,
        GVT: 20,
        DRGN: 20,
        NVZN: 20,
        CNB: 20,
        LINK: 10, 
        UNI: 10, 
        SHIB: 10, 
        CRO: 10, 
        GALA: 10, 
        POLY: 10, 
        CRV: 10, 
        SAND: 10, 
        COMP: 10, 
        BAT: 10, 
        SUSHI: 10, 
        CVC: 10, 
        CELR: 10, 
        YFI: 10, 
        SLP: 10
    },
    PaymentMethod: {
        ETransfer: {
            AccountName: 'Exchangily',
            Email: 'dora.tang@exchangily.com'
        },
        Wechat: 'exchangily',
        Alipay: 'info@exchangily.com',
        DirectTransfer: {
            BankName: '招商银行',
            AccountName: 'Exchangily',
            Account: '88884556555433234455'
        }
    }
};
