// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
    production: false,
    version: '2.2.13',
    IssueTokenReceipt: 'mxU2i997YxYv75E6YNVNwkN5qJ68WC5sZN',
    SQUARE_APP_ID: {
        CAD: 'sandbox-sq0idb-UUMNZpqOLdU5yOO9Y6AKyg', // ccount kenin
        USD: 'sandbox-sq0idb-gPdLBTvUKUk2-O2DdNZ3dA'  // account genta
    },
    EPAY_API: 'http://29597375fx.zicp.vip/paymentApi',
    STRIPE_PUBLIC_KEY: 'pk_test_xVAqsYMxwh3AZfJcYu1hruyE',
    PAYPAL_CLIENT_ID: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x',
    url: 'https://kanbantest.fabcoinapi.com/',

    PUBLIC_KEY: '8aff99f9727143fccd28e62df14e4e67305faa70d19b4cb0b9d4cde18ea3cd23c8e58bda3c26e10813aaa6020f3d07a3d9f83a9062cfe662a600949325378b99',
    // baseUrl: 'http://localhost:4200',
    baseUrl: 'https://test.exchangily.com',
    campaignId: 1,
    OTC_COMMISSION_RATE: 0,
    chains: {
        BTC: {
            network: Btc.networks.testnet,
            satoshisPerBytes: 60,
            bytesPerInput: 148
        },

        DOGE: {
            network: {
                messagePrefix: '\u0019Dogecoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                    public: 0x043587cf,
                    private: 0x04358394,
                },
                pubKeyHash: 0x71,
                scriptHash: 0xc4,
                wif: 0xf1,
            },
            satoshisPerBytes: 400000,
            bytesPerInput: 148
        },
        LTC: {
            network: {
                messagePrefix: '\u0019Litecoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                    public: 0x0436f6e1,
                    private: 0x0436ef7d,
                },
                pubKeyHash: 0x6f,
                scriptHash: 0x3a,
                wif: 0xef,
            },
            satoshisPerBytes: 200,
            bytesPerInput: 148
        },
        BCH: {
            network: {
                messagePrefix: '\u0018Bitcoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                    public: 0x043587cf,
                    private: 0x04358394,
                },
                pubKeyHash: 0x6f,
                scriptHash: 0xc4,
                wif: 0xef,
            },
            satoshisPerBytes: 50,
            bytesPerInput: 148
        },
        ETH: {
            chain: 'ropsten',
            hardfork: 'byzantium',
            gasPrice: 90,
            gasPriceMax: 200,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        BNB: {
            chain: {
                name: 'testnet',
                networkId: 97,
                chainId: 97
            },
            rpcEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            hardfork: 'byzantium',
            gasPrice: 5,
            gasPriceMax: 100,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        MATIC: {
            chain: {
                name: 'testnet',
                networkId: 80001,
                chainId: 80001
            },
            rpcEndpoint: 'https://rpc-mumbai.matic.today',
            hardfork: 'byzantium',
            gasPrice: 5,
            gasPriceMax: 100,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        HT: {
            chain: {
                name: 'testnet',
                networkId: 256,
                chainId: 256
            },
            rpcEndpoint: 'https://http-testnet.hecochain.com',
            hardfork: 'byzantium',
            gasPrice: 5,
            gasPriceMax: 100,
            gasLimit: 21000,
            gasLimitToken: 70000
        },
        FAB: {
            network: Btc.networks.testnet,
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212 
            },
            satoshisPerBytes: 100,
            bytesPerInput: 148,
            gasPrice: 40,
            gasLimit: 100000
        },
        KANBAN: {
            chain: {
                name: 'test',
                networkId: 212,
                chainId: 212
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
        // blockchaingate: 'http://localhost:3002/v2/',
        blockchaingate: 'https://test.blockchaingate.com/v2/',
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
        },
        BCH: {
            exchangily: 'https://bchtest.fabcoinapi.com/',
        },
        DOGE: {
            exchangily: 'https://dogetest.fabcoinapi.com/',
        },
        LTC: {
            exchangily: 'https://ltctest.fabcoinapi.com/',
        }

        // pricehistory: 'http://18.223.17.4:3002/klinedata/'

    },
    CoinType: {
        BTC: 1,
        ETH: 60,
        BNB: 60,
        HT: 60,
        MATIC: 60,
        FAB: 1150,
        BCH: 1,
        LTC: 1,
        DOGE: 1,
        TRX: 195
    },
    addresses: {
        smartContract: {
            FABLOCK: '0xa7d4a4e23bf7dd7a1e03eda9eb7c28a016fd54aa',
            StakingFABEXG: '0xb6af31442fef2e631dfcfe02de59ef703c961717',
            EXG: {
                FAB: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
                ETH: '0x9cffdbe1bc18c3de44893107b8d2b16d515dbbf7'
            },
            USDT: { 
                ETH: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
                TRX: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
                BNB: '0x4850754EA867654339F38d4e6DF7cd80CFee141f',
                MATIC: '0x26CbCDe3842D9A9170d47F122F69D993a00676ED'
            },
            USDC: {
                ETH: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
                TRX: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
            },
            FAB: {
                ETH: '0xd8b836a7276b3D28FE98CE9d5C8D3041051b792C',
                BNB: '0xb3Dcd26FBFCC3aeA2aa0ac833c2B38421d4b1905'
            },
            IXT: {
                MATIC: '0x65f8C5d105c61dfEe73C402593CD90ABb5bcB48e'
            },
            DSC: {
                FAB: '0xc65624b3bbdf3e786705045405b5f09ab811b9dd',
                ETH: '0x2c4eac82c6aca937c9dc30796f1f8e7f1c04843b'
            }, 
            BST: {
                FAB: '0x3407424d43886a93434e7ff220c1c5a3bf75327b',
                ETH: '0x3732abecb2b660334ea71c029b10494ce9972cfe'
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
            CTG: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            HNC: '0x122fd42c61bc66b0cd6cdbf302a0ca297497e240',
            CABTC: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DUSD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            TWBTC: '0x569e4c00dbae584eb3e2189739eae951886ac2a3',
            DCAD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DCNY: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DJPY: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DGBP: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DEURO: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DAUD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DMYR: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DKRW: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DPHP: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DTHB: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DTWD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DSGD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DHKD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DINR: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DMXN: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DBRL: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            DNGN: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
            INB: '0x919c6d21670fe8cEBd1E86a82a1A74E9AA2988F8',
            REP: '0x4659c4A33432A5091c322E438e0Fb1D286A1EbdE',
            HOT: '0x6991d9fff5de74085f5c786d425403601280c8f4',
            CEL: '0xa07a1ab0a8e4d95683dce8d22d0ed665499f0a2b',
            MATIC: '0x39ccec89a2251652265ab63fdcd551b6f65e37d5',
            IOST: '0x4dd868d8d961f202e3244a25871105b5e1feaa62',
            MANA: '0x4527fa0ce6f221a7b9e54412d7a3edd9a37c350a',
            FUN: '0x98e6affb8192ffd89a62e27dc5a594cd3c1fc8db', //??
            WAX: '0xb2140669d08a02b78a9fb4a9ebe36371ae023e5f',
            ELF: '0xdd3d64919c119a7cde45763b94cf3d1b33fdaff7',
            GNO: '0x94fd1b18c927935d4f1751239172ad212281f4ac',
            POWR: '0x6e981f5d973a3ab55ff9db9a77f4123b71d833dd',
            WINGS: '0x08705dc287150ba2da249b5a1b0c3b99c71b4100',
            MTL: '0x1c9b5afa112b42b12fb06b62e5f1e159af49dfa7',
            KNC: '0x3aad796ceb3a1063f727c6d0c698e37053292d10',
            GVT: '0x3e610d9fb322063e50d185e2cc1b45f007e7180c',
            DRGN: '0xbbdd7a557a0d8a9bf166dcc2730ae3ccec7df05c',
            NVZN: '0xf18e828a19c00764522e50a511fffd521de4b119',
            CNB: '0x466bc642fdd001b49aa8fa76c8058934bd428526',
            CSU: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',

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
       exchangilyOfficial: {
        FAB: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        BTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        BNB: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        MATIC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        BCH: 'bchtest:qrkhd038rw685m0s2kauyquhx0pxlhkvsg6dydtwn9',
        LTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        DOGE: 'nqqkf8PqJj3CUjwLMEcjJDfpiU5NDcMUrB',        
        TRX: 'TGGJPohUhzpW8W1LTRhPejGK8LDyR7ofM3'
        /*
        EXG: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
        FAB: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        BTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        USDT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        DUSD: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
        BCH: 'bchtest:qrkhd038rw685m0s2kauyquhx0pxlhkvsg6dydtwn9',
        LTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        DOGE: 'nqqkf8PqJj3CUjwLMEcjJDfpiU5NDcMUrB',
        INB: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        REP: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        HOT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        CEL: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        MATIC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        IOST: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        MANA: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        FUN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E', // ??
        WAX: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        ELF: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        GNO: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E', 
        POWR: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        WINGS: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        MTL: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        KNC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        GVT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        DRGN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        NVZN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        CNB: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
        TRX: 'TGGJPohUhzpW8W1LTRhPejGK8LDyR7ofM3'
        */
       },
        promotionOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
        },
        otcOfficial: {
            USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
            DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
            BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
            ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
            FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
        }
    },
    websockets: {
        allprices: 'wss://kanbantest.fabcoinapi.com/ws/allprices',
        trades: 'wss://kanbantest.fabcoinapi.com/ws/trades',
        orders: 'wss://kanbantest.fabcoinapi.com/ws/orders',
        kline: 'wss://kanbantest.fabcoinapi.com/ws/ticker'
    },
    minimumWithdraw: {
        EXG: {
            FAB: 50,
            ETH: 100
        },
        DSC: {
            FAB: 50,
            ETH: 250
        },
        BST: {
            FAB: 10,
            ETH: 50
        },                
        BTC: 0.002,
        FAB: {
            FAB: 50,
            ETH: 100,
            BNB: 2
        },
        ETH: 0.01,
        USDT: {
            ETH: 10,
            TRX: 0.2,
            BNB: 2,
            MATIC: 0.1
        },
        CTG: 10,
        SEED: 1,
        BUSD: 2,
        HNC: 2000,
        FET: 100,
        GET: 0.0000001,
        CABTC: 12.68,
        TRX: 0.2,
        IXT: 0.006,
        DUSD: 10,
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
        TWBTC: 1,
        DMXN: 200,
        DBRL: 60,
        DNGN: 4000,
        BCH: 0.002,
        LTC: 0.02,
        DOGE: 20,
        BNB: 0.001,
        INB: 20,
        REP: 0.8,
        HOT: 16000,
        CEL: 40,
        MATIC: {
            ETH:500,
            MATIC: 0.004
        },
        IOST: 2000,
        MANA: 240,
        FUN: 3000,
        WAX: 200,
        ELF: 100,
        GNO: 0.4,
        POWR: 100,
        WINGS: 200,
        MTL: 40,
        KNC: 10,
        GVT: 10,
        DRGN: 100,
        NVZN: 100,
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
        TWBTC: 12,
        DINR: 12,
        DMXN: 12,
        DBRL: 12,
        DNGN: 12,        
        CTG: 12,
        SEED: 12,
        FET: 12,
        GET: 12,
        BUSD: 15,
        HNC: 10,
        CABTC: 12,
        BCH: 2,
        LTC: 8,
        DOGE: 20,
        BNB: 12,
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
            Email: 'info@exchangily.com'
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

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone._run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
