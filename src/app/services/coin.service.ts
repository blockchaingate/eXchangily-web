import { Injectable } from '@angular/core';
import { MyCoin } from '../models/mycoin';
import * as Btc from 'bitcoinjs-lib';

import * as bitcoinMessage from 'bitcoinjs-message';
// import { hdkey } from 'ethereumjs-wallet/dist'; // v1.0.1 version, not working?
import { hdkey } from 'ethereumjs-wallet';
import * as bchaddr from 'bchaddrjs';
import { Address } from '../models/address';
import { coin_list } from '../config/coins';
import { ApiService } from './api.service';
import * as wif from 'wif';
import * as bitcore from 'bitcore-lib-cash';
import * as BchMessage from 'bitcore-message';
import { Web3Service } from './web3.service';
import { Signature } from '../interfaces/kanban.interface';
import { UtilService } from './util.service';
import { environment } from '../../environments/environment';
import BigNumber from "bignumber.js";
import TronWeb from 'tronweb';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(environment.chains.TRX.fullNode);
const solidityNode = new HttpProvider(environment.chains.TRX.solidityNode);
const eventServer = new HttpProvider(environment.chains.TRX.eventServer);
const ADDRESS_PREFIX_REGEX = /^(41)/;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer
);

@Injectable()
export class CoinService {
    txids: any;
    constructor(private apiService: ApiService, private web3Serv: Web3Service, private utilServ: UtilService) {
        this.txids = [];
    }

    getCoinTypeIdByName(name: string) {
        name = name.toUpperCase();
        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.name === name) {
                return coin.id;
            }
        }
        return -1;
    }

    convertTrxAddressToHex(trxAddress: string) {
        const address = tronWeb.address.toHex(trxAddress).replace(ADDRESS_PREFIX_REGEX, '0x');
        return address;
    }

    async getTrxTokenName(smartContractAddress) {
        try {
            let contract = await tronWeb.contract().at(smartContractAddress);
            //Use call to execute a pure or view smart contract method.
            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
            let result = await contract.name().call({from: environment.addresses.exchangilyOfficial.TRX});
            console.log('result: ', result);
            return result;
        } catch(error) {
            console.error("trigger smart contract error",error)
        }
        return '';
    }

    async getTrxTokenDecimals(smartContractAddress) {
        try {
            let contract = await tronWeb.contract().at(smartContractAddress);
            //Use call to execute a pure or view smart contract method.
            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
            let result = await contract.decimals().call({from: environment.addresses.exchangilyOfficial.TRX});
            console.log('result: ', result);
            return result;
        } catch(error) {
            console.error("trigger smart contract error",error)
        }
        return '';
    }

    async getTrxTokenSymbol(smartContractAddress) {
        try {
            let contract = await tronWeb.contract().at(smartContractAddress);
            //Use call to execute a pure or view smart contract method.
            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
            let result = await contract.symbol().call({from: environment.addresses.exchangilyOfficial.TRX});
            console.log('result: ', result);
            return result;
        } catch(error) {
            console.error("trigger smart contract error",error)
        }
        return '';
    }

    
    getCoinNameByTypeId(id: number) {

        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.id == id) {
                return coin.name;
            }
        }
        return '';
    }


    async getEthGasprice() {
        const gasPrice = await this.apiService.getEthGasPrice();
        return new BigNumber(gasPrice).shiftedBy(-9).toNumber();
    }

    async getEtheruemCompatibleGasprice(coinName: string) {
        const gasPrice = await this.apiService.getEtheruemCompatibleGasPrice(coinName);
        console.log('gasPrice origin=', gasPrice);
        let gasPriceInGWei = new BigNumber(gasPrice).shiftedBy(-9).toNumber();
        //gasPriceInGWei += 20;
        return gasPriceInGWei;
    }

    async getTrxTokenBalance(smartContractAddress: string, address: string) {
        

        // address = 'TM2TmqauSEiRf16CyFgzHV2BVxBejY9iyR';
        // address = tronWeb.address.toHex(address);
        // console.log('address=', address);
        // smartContractAddress = tronWeb.address.toHex(address);
        // console.log('smartContractAddress=', smartContractAddress);
        try {
            const contract = await tronWeb.contract().at(smartContractAddress);
            // Use call to execute a pure or view smart contract method.
            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.

            if (contract.balanceOf(address)) {
                const result = await contract.balanceOf(address).call({from: address});
                console.log('result===', result);
                return result.toString();
            }
            return -1;
            // console.log('result: ', result);
        } catch (error) {
            console.error('trigger smart contract error', error);
        }  
        
        return -1;
    }

    async getEtherumCompatibleTokenBalance(chainName: string, smartContractAddress: string, address: string) {
        return await this.apiService.getEthereumCompatibleTokenBalance(chainName, smartContractAddress, address);

    }

    initToken(type: string, name: string, decimals: number, address: string, baseCoin: MyCoin, symbol?: string) {
        const coin = new MyCoin(name);
        if(symbol) {
            coin.symbol = symbol;
        }
        coin.tokenType = type;
        coin.decimals = decimals;
        coin.contractAddr = address;
        coin.coinType = baseCoin.coinType;
        coin.baseCoin = baseCoin;
        const addr = new Address(baseCoin.coinType, baseCoin.receiveAdds[0].address, 0);
        coin.receiveAdds.push(addr);
     
        return coin;
    }

    addTxids(txids) {
        this.txids = this.txids.concat(txids);
    }

    initCoin(seed: Buffer, type: string) {
        const coin = new MyCoin(type);
        this.fillUpAddress(coin, seed, 1, 0);
        return coin;
    }

    initMyCoins(seed: Buffer): MyCoin[] {
        const myCoins: any = [];

        const fabCoin:any = new MyCoin('FAB');
        this.fillUpAddress(fabCoin, seed, 1, 0);

        const exgCoin: any = this.initToken('FAB', 'EXG', 18, environment.addresses.smartContract.EXG.FAB, fabCoin);
        this.fillUpAddress(exgCoin, seed, 1, 0);

        myCoins.push(exgCoin);
        myCoins.push(fabCoin);

        const btcCoin = new MyCoin('BTC');
        this.fillUpAddress(btcCoin, seed, 1, 0);
        myCoins.push(btcCoin);

        const ethCoin = new MyCoin('ETH');
        this.fillUpAddress(ethCoin, seed, 1, 0);
        myCoins.push(ethCoin);

        const trxCoin = new MyCoin('TRX');
        this.fillUpAddress(trxCoin, seed, 1, 0);
        myCoins.push(trxCoin);

        const bnbCoin = new MyCoin('BNB');
        this.fillUpAddress(bnbCoin, seed, 1, 0);
        myCoins.push(bnbCoin);

        const usdtBNBCoin = this.initToken('BNB', 'USDT', 18, environment.addresses.smartContract.USDT.BNB, bnbCoin);
        this.fillUpAddress(usdtBNBCoin, seed, 1, 0);
        myCoins.push(usdtBNBCoin);  

        const fabBNBCoin = this.initToken('BNB', 'FAB', 8, environment.addresses.smartContract.FAB.BNB, bnbCoin);
        this.fillUpAddress(fabBNBCoin, seed, 1, 0);
        myCoins.push(fabBNBCoin);  

        const busdBNBCoin = this.initToken('BNB', 'BUSD', 18, environment.addresses.smartContract.BUSD, bnbCoin);
        this.fillUpAddress(busdBNBCoin, seed, 1, 0);
        myCoins.push(busdBNBCoin);  

        const kushBNBCoin = this.initToken('BNB', 'KUSH', 18, environment.addresses.smartContract.KUSH.BNB, bnbCoin);
        this.fillUpAddress(kushBNBCoin, seed, 1, 0);
        myCoins.push(kushBNBCoin);  

        const hsBNBCoin = this.initToken('BNB', 'HS', 18, environment.addresses.smartContract.HS.BNB, bnbCoin);
        this.fillUpAddress(hsBNBCoin, seed, 1, 0);
        myCoins.push(hsBNBCoin);  

        const maticCoin = new MyCoin('MATIC');
        this.fillUpAddress(maticCoin, seed, 1, 0);
        myCoins.push(maticCoin);

        const usdtMATICCoin = this.initToken('MATIC', 'USDT', 6, environment.addresses.smartContract.USDT.MATIC, maticCoin);
        this.fillUpAddress(usdtMATICCoin, seed, 1, 0);
        myCoins.push(usdtMATICCoin); 

        const ixtMATICCoin = this.initToken('MATIC', 'IXT', 18, environment.addresses.smartContract.IXT.MATIC, maticCoin);
        this.fillUpAddress(ixtMATICCoin, seed, 1, 0);
        myCoins.push(ixtMATICCoin);  

        const usdtTRXCoin = this.initToken('TRX', 'USDT', 6, environment.addresses.smartContract.USDT.TRX, trxCoin);
        this.fillUpAddress(usdtTRXCoin, seed, 1, 0);
        myCoins.push(usdtTRXCoin);        

        const usdtCoin = this.initToken('ETH', 'USDT', 6, environment.addresses.smartContract.USDT.ETH, ethCoin);
        this.fillUpAddress(usdtCoin, seed, 1, 0);
        myCoins.push(usdtCoin);

        const usdcTRXCoin = this.initToken('TRX', 'USDC', 6, environment.addresses.smartContract.USDC.TRX, trxCoin);
        this.fillUpAddress(usdcTRXCoin, seed, 1, 0);
        myCoins.push(usdcTRXCoin);        

        const usdcCoin = this.initToken('ETH', 'USDC', 6, environment.addresses.smartContract.USDC.ETH, ethCoin);
        this.fillUpAddress(usdcCoin, seed, 1, 0);
        myCoins.push(usdcCoin);        

        const dusdCoin = this.initToken('FAB', 'DUSD', 6, environment.addresses.smartContract.DUSD, fabCoin);

        this.fillUpAddress(dusdCoin, seed, 1, 0);

        myCoins.push(dusdCoin);

        const dscCoin = this.initToken('FAB', 'DSC', 18, environment.addresses.smartContract.DSC.FAB, fabCoin);

        this.fillUpAddress(dscCoin, seed, 1, 0);

        myCoins.push(dscCoin);    


        const bstCoin = this.initToken('FAB', 'BST', 18, environment.addresses.smartContract.BST.FAB, fabCoin);

        this.fillUpAddress(bstCoin, seed, 1, 0);

        myCoins.push(bstCoin);  


        
        const seedCoin = this.initToken('FAB', 'SEED', 18, environment.addresses.smartContract.SEED.FAB, fabCoin);

        this.fillUpAddress(seedCoin, seed, 1, 0);

        myCoins.push(seedCoin);     


        const fetCoin = this.initToken('FAB', 'FET', 18, environment.addresses.smartContract.FET.FAB, fabCoin);

        this.fillUpAddress(fetCoin, seed, 1, 0);

        myCoins.push(fetCoin);   
        
        const getCoin = this.initToken('FAB', 'GET', 6, environment.addresses.smartContract.GET.FAB, fabCoin);

        this.fillUpAddress(getCoin, seed, 1, 0);

        myCoins.push(getCoin);           


        const brbCoin = this.initToken('FAB', 'BRB', 18, environment.addresses.smartContract.BRB.FAB, fabCoin);

        this.fillUpAddress(brbCoin, seed, 1, 0);

        myCoins.push(brbCoin);     


        const stableCoins = [
            'DCAD', 'DCNY', 'DJPY', 'DGBP', 'DEURO', 'DAUD', 'DMYR', 
            'DKRW', 'DPHP', 'DTHB', 'DTWD', 'DSGD', 'DHKD', 'DINR', 
            'DMXN', 'DBRL', 'DNGN', 'TWBTC', 'CTG', 'CABTC'
        ];
        
        for(let i = 0; i < stableCoins.length; i++) {
            const item = stableCoins[i];
            const stableCoin = this.initToken('FAB', item, 6, environment.addresses.smartContract[item]['FAB'] ? environment.addresses.smartContract[item]['FAB'] : environment.addresses.smartContract[item], fabCoin);
            this.fillUpAddress(stableCoin, seed, 1, 0);
            myCoins.push(stableCoin);
        }


        const csuCoin = this.initToken('FAB', 'CSU', 8, environment.addresses.smartContract.BST.FAB, fabCoin);

        this.fillUpAddress(csuCoin, seed, 1, 0);

        myCoins.push(csuCoin);  


        const bchCoin = new MyCoin('BCH');

        this.fillUpAddress(bchCoin, seed, 1, 0);

        myCoins.push(bchCoin);

        const ltcCoin = new MyCoin('LTC');

        this.fillUpAddress(ltcCoin, seed, 1, 0);

        myCoins.push(ltcCoin);

        const dogCoin = new MyCoin('DOGE');
        this.fillUpAddress(dogCoin, seed, 1, 0);
        myCoins.push(dogCoin);


        let tokenName = 'FAB';
        let token = this.initToken('ETH', tokenName, 8, environment.addresses.smartContract.FAB.ETH, ethCoin);
        this.fillUpAddress(token, seed, 1, 0);
        myCoins.push(token);

        tokenName = 'EXG';
        token = this.initToken('ETH', tokenName, 18, environment.addresses.smartContract.EXG.ETH, ethCoin);
        this.fillUpAddress(token, seed, 1, 0);
        myCoins.push(token);

        tokenName = 'DSC';
        token = this.initToken('ETH', tokenName, 18, environment.addresses.smartContract.DSC.ETH, ethCoin);
        this.fillUpAddress(token, seed, 1, 0);
        myCoins.push(token);

        tokenName = 'BST';
        token = this.initToken('ETH', tokenName, 18, environment.addresses.smartContract.BST.ETH, ethCoin);
        this.fillUpAddress(token, seed, 1, 0);
        myCoins.push(token);        


        const erc20Tokens = [
            {
                name: 'HNC',
                decimals: 18
            },
            {
                name: 'LINK',
                decimals: 18
            },
            {
                name: 'UNI',
                decimals: 18
            },
            {
                name: 'SHIB',
                decimals: 18
            },
            {
                name: 'CRO',
                decimals: 8
            },
            {
                name: 'GALA',
                decimals: 8
            },
            {
                name: 'POLY',
                decimals: 18
            },
            {
                name: 'CRV',
                decimals: 18
            },
            {
                name: 'SAND',
                decimals: 18
            },
            {
                name: 'COMP',
                decimals: 18
            },
            {
                name: 'BAT',
                decimals: 18
            },
            {
                name: 'SUSHI',
                decimals: 18
            },
            {
                name: 'CVC',
                decimals: 8
            },
            {
                name: 'CELR',
                decimals: 18
            },
            {
                name: 'YFI',
                decimals: 18
            },
            {
                name: 'SLP',
                decimals: 0
            },
            { 
                name: 'INB', 
                decimals: 18
            },
            {
                name: 'REP',
                decimals: 18
            },
            {  
                name: 'HOT',
                decimals: 18
            },
            {   
                name: 'MATIC', 
                decimals: 18
            },
            {   
                name:'IOST', 
                decimals: 18
            },
            {   
                name: 'MANA', 
                decimals: 18
            },
            {   
                name: 'ELF', 
                decimals: 18
            },
            {   
                name: 'GNO', 
                decimals: 18
            },
            {
                name: 'WINGS', 
                decimals: 18
            },
            {   
                name: 'KNC', 
                decimals: 18
            },
            {   
                name: 'GVT', 
                decimals: 18
            },
            {
                name: 'DRGN',
                decimals: 18
            },
            {
                name: 'FUN', 
                decimals: 8
            },
            {
                name: 'WAX', 
                decimals: 8
            },
            {
                name: 'MTL',
                decimals: 8
            },
            {
                name: 'POWR',
                decimals: 6
            },
            {
                name: 'CEL',
                decimals: 4
            },

        ];


        for (let i = 0; i < erc20Tokens.length; i++) {
            const token = erc20Tokens[i];
            const tokener = this.initToken('ETH', token.name, token.decimals, environment.addresses.smartContract[token.name], ethCoin);
            this.fillUpAddress(tokener, seed, 1, 0);
            myCoins.push(tokener);
        }
        /*
        const erc20Tokens2 = ['FUN', 'WAX', 'MTL'];

        for (let i = 0; i < erc20Tokens2.length; i++) {
            const token_Name = erc20Tokens2[i];
            const tokener = this.initToken('ETH', token_Name, 8, environment.addresses.smartContract[token_Name], ethCoin);
            this.fillUpAddress(tokener, seed, 1, 0);
            myCoins.push(tokener);
        }
        
        tokenName = 'POWR';
        token = this.initToken('ETH', tokenName, 6, environment.addresses.smartContract[tokenName], ethCoin);
        this.fillUpAddress(token, seed, 1, 0);
        myCoins.push(token);

        tokenName = 'CEL';
        token = this.initToken('ETH', tokenName, 4, environment.addresses.smartContract[tokenName], ethCoin);
        this.fillUpAddress(token, seed, 1, 0);
        myCoins.push(token);
*/

        const cnbCoin = this.initToken('FAB', 'CNB', 18, environment.addresses.smartContract.CNB, fabCoin);
        this.fillUpAddress(cnbCoin, seed, 1, 0);
        myCoins.push(cnbCoin);

        return myCoins;
    }

    initBTCinFAB(seed: Buffer) {
        const coin = new MyCoin('BTC');
        coin.coinType = environment.CoinType.FAB;
        this.fillUpAddress(coin, seed, 1, 0);
        return coin;
    }

    initFABinBTC(seed: Buffer) {
        const coin = new MyCoin('FAB');
        coin.coinType = environment.CoinType.BTC;
        this.fillUpAddress(coin, seed, 1, 0);
        return coin;
    }

    initMyCoinsOld(seed: Buffer): MyCoin[] {
        const myCoins = new Array();

        const fabCoin = new MyCoin('FAB');
        fabCoin.coinType = 0;
        this.fillUpAddress(fabCoin, seed, 1, 0);

        const exgCoin = this.initToken('FAB', 'EXG', 18, environment.addresses.smartContract.EXG.FAB, fabCoin);
        exgCoin.coinType = 0;
        this.fillUpAddress(exgCoin, seed, 1, 0);

        myCoins.push(exgCoin);
        myCoins.push(fabCoin);

        const btcCoin = new MyCoin('BTC');
        btcCoin.coinType = 0;
        this.fillUpAddress(btcCoin, seed, 1, 0);
        myCoins.push(btcCoin);

        const ethCoin = new MyCoin('ETH');
        ethCoin.coinType = 0;
        this.fillUpAddress(ethCoin, seed, 1, 0);
        myCoins.push(ethCoin);

        /*
        coin = new MyCoin('USDT');
        this.fillUpAddress(coin, seed, 1, 0);
        myCoins.push(coin);  
        */
        const usdtCoin = this.initToken('ETH', 'USDT', 6, environment.addresses.smartContract.USDT.ETH, ethCoin);
        usdtCoin.coinType = 0;
        this.fillUpAddress(usdtCoin, seed, 1, 0);
        myCoins.push(usdtCoin);

        return myCoins;
    }

    initExCoin(seed: Buffer): MyCoin {
        const coin = new MyCoin('EX');
        this.fillUpAddress(coin, seed, 1, 0);
        return coin;
    }

    initExCoinOld(seed: Buffer): MyCoin {
        const coin = new MyCoin('EX');
        coin.coinType = 0;
        this.fillUpAddress(coin, seed, 1, 0);
        return coin;
    }

    isDepositable(coin: MyCoin): boolean {
        const name = coin.name;
        const tokenType = coin.tokenType;
        if (!tokenType) {
            return true;
        }
        if (environment.addresses.smartContract[name] || environment.addresses.smartContract[name][tokenType]) {
            if (this.getCoinTypeIdByName(name) > 0) {
                return true;
            }
            
        }
        return false;
    }

    getOfficialAddress(myCoin: MyCoin) {
        const coinName = myCoin.name;
        const tokenType = myCoin.tokenType;

        const chain = tokenType ? tokenType : coinName;
        //console.log('chain===', chain);
        if (environment.addresses.exchangilyOfficial[chain]) {
            let address = environment.addresses.exchangilyOfficial[chain];
            //console.log('address====', address);
            if (tokenType === 'FAB') {
                address = this.utilServ.fabToExgAddress(address);
            }
            //console.log('newAddress===', address);
            return address;
        }
        return '';
    }

    async depositFab(scarContractAddress: string, seed: any, mycoin: MyCoin, amount: number) {
        // sendTokens in https://github.com/ankitfa/Fab_sc_test1/blob/master/app/walletManager.js
        const gasLimit = 800000;
        const gasPrice = 40;

        // console.log('scarContractAddress=', scarContractAddress);
        const totalAmount = gasLimit * gasPrice / 1e8;
        // let cFee = 3000 / 1e8 // fee for the transaction

        let totalFee = totalAmount;

        // -----------------------------------------------------------------------
        const addDepositFunc: any = {
            'constant': false,
            'inputs': [],
            'name': 'addDeposit',
            'outputs': [
                {
                    'name': '',
                    'type': 'address'
                }
            ],
            'payable': true,
            'stateMutability': 'payable',
            'type': 'function'
        };

        let fxnCallHex = this.web3Serv.getGeneralFunctionABI(addDepositFunc, []);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);

        // console.log('fxnCallHexfxnCallHexfxnCallHexfxnCallHexfxnCallHex=', fxnCallHex);
        const contract = Btc.script.compile([
            84,
            this.utilServ.number2Buffer(gasLimit),
            this.utilServ.number2Buffer(gasPrice),
            this.utilServ.hex2Buffer(fxnCallHex),
            this.utilServ.hex2Buffer(scarContractAddress),
            194
        ]);

        // console.log('contract=', contract);
        const contractSize = contract.toJSON.toString().length;

        // console.log('contractSize=' + contractSize);
        totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

        // console.log('totalFee=' + totalFee);
        const res = await this.getFabTransactionHex(seed, mycoin, contract, amount, totalFee,
            environment.chains.FAB.satoshisPerBytes, environment.chains.FAB.bytesPerInput, false);

        const txHex = res.txHex;
        let errMsg = res.errMsg;
        let txHash = '';
        if (!errMsg) {
            const res2 = await this.apiService.postFabTx(txHex);
            txHash = res2.txHash;
            errMsg = res2.errMsg;
        }
        return { txHash: txHash, errMsg: errMsg };
    }

    async getBlanceByAddress(tokenType: string, contractAddr: string, name: string, addr: string, decimals: number) {
        let balance = 0;
        let lockbalance = 0;
        if (name === 'BTC') {
            const balanceObj = await this.apiService.getBtcBalance(addr);
            balance = balanceObj.balance / 1e8;
            lockbalance = balanceObj.lockbalance / 1e8;
        } else if (name === 'ETH') {
            const balanceObj = await this.apiService.getEthBalance(addr);
            balance = balanceObj.balance / 1e18;
            lockbalance = balanceObj.lockbalance / 1e18;
        } else if(['MATIC', 'HT', 'BNB'].indexOf(name) >= 0) {  
            const balanceObj = await this.apiService.getEthereumCompatibleBalance(name, addr);
            console.log('balanceObj====', balanceObj);
            balance = new BigNumber(balanceObj, 16).shiftedBy(-18).toNumber();
            lockbalance = 0;     
        } else if(tokenType == 'TRX') {
            const balanceObj = await this.getTrxTokenBalance(contractAddr, addr);
            console.log('balanceObj for trxxxx=', balanceObj);
            balance = new BigNumber(balanceObj).shiftedBy(-decimals).toNumber();
            lockbalance = 0;   
        } else if(['MATIC', 'HT', 'BNB'].indexOf(tokenType) >= 0) {  
            const balanceObj = await this.apiService.getEthereumCompatibleTokenBalance(tokenType, contractAddr, addr);
            balance = new BigNumber(balanceObj, 16).shiftedBy(-decimals).toNumber();
            lockbalance = 0;                  
        } else if (name === 'BCH') {
            const balanceObj = await this.apiService.getBchBalance(addr);
            balance = balanceObj.balance / 1e18;
            lockbalance = balanceObj.lockbalance / 1e18;
        } else if (name === 'FAB') {
            const balanceObj = await this.apiService.getFabBalance(addr);
            balance = balanceObj.balance / 1e8;
            lockbalance = balanceObj.lockbalance / 1e8;
        } else if (tokenType === 'ETH') {
            if (!decimals) {
                decimals = 18;
            }
            const balanceObj = await this.apiService.getEthTokenBalance(name, contractAddr, addr);
            balance = balanceObj.balance / Math.pow(10, decimals);
            lockbalance = balanceObj.lockbalance / Math.pow(10, decimals);
        } else if (tokenType === 'FAB') {
            if (addr.indexOf('0x') < 0) {
                addr = this.utilServ.fabToExgAddress(addr);
            }
            let balanceObj;
            if (name === 'EXG') {
                balanceObj = await this.apiService.getExgBalance(addr);
            } else {
                balanceObj = await this.apiService.getFabTokenBalance(name, addr, contractAddr);
            }
            if(decimals && Number(decimals) >= 0) {
                balance = balanceObj.balance / Math.pow(10, decimals);
                lockbalance = balanceObj.lockbalance / Math.pow(10, decimals);
            } else {
                balance = 0;
                lockbalance = 0;
            }

        }
        return { balance, lockbalance };
    }

    walletBalance(data: any) {
        return this.apiService.getWalletBalance(data);
    }

    getTransactionHistoryEvents(data: any) {
        return this.apiService.getTransactionHistoryEvents(data);
    }

    async getFabTransactionReceipt(txid: string) {
        return await this.apiService.getFabTransactionReceiptAsync(txid);
    }
    async getBalance(myCoin: MyCoin) {
        console.log('myCoin.name for getBalance=', myCoin);
        let balance;
        let totalBalance = 0;
        let totalLockBalance = 0;
        const coinName = myCoin.name;
        const tokenType = myCoin.tokenType;
        const contractAddr = myCoin.contractAddr;

        let receiveAddsLen = myCoin.receiveAdds.length;
        let changeAddsLen = myCoin.changeAdds.length;

        if (coinName === 'BTC') {
            receiveAddsLen = (receiveAddsLen > 3) ? 3 : receiveAddsLen;
            changeAddsLen = (changeAddsLen > 3) ? 3 : changeAddsLen;
        }
        if (coinName === 'FAB') {
            receiveAddsLen = (receiveAddsLen > 1) ? 1 : receiveAddsLen;
            changeAddsLen = (changeAddsLen > 1) ? 1 : changeAddsLen;
        }

        for (let i = 0; i < 1; i++) {
            if ((!myCoin.receiveAdds) || (myCoin.receiveAdds.length === 0)) {
                continue;
            }
            const addr = myCoin.receiveAdds[i].address;

            const decimals = myCoin.decimals;
            balance = await this.getBlanceByAddress(tokenType, contractAddr, coinName, addr, decimals);
            myCoin.receiveAdds[i].balance = balance.balance;
            totalBalance += balance.balance;
            myCoin.receiveAdds[i].lockedBalance = balance.lockbalance;
            totalLockBalance += balance.lockbalance;
        }

        for (let i = 0; i < 1; i++) {
            if ((!myCoin.changeAdds) || (myCoin.changeAdds.length === 0)) {
                continue;
            }
            const addr = myCoin.changeAdds[i].address;
            const decimals = myCoin.decimals;
            balance = await this.getBlanceByAddress(tokenType, contractAddr, coinName, addr, decimals);

            myCoin.changeAdds[i].balance = balance.balance;
            totalBalance += balance.balance;
            myCoin.receiveAdds[i].lockedBalance = balance.lockbalance;
            totalLockBalance += balance.lockbalance;
        }
        return { balance: totalBalance, lockbalance: totalLockBalance };
    }

    getKeyPairsFromPrivateKey(coin: MyCoin, privateKey: string) {
        const name = coin.name;

        let addr: any = '';
        const addrHash = '';
        let priKey;
        let pubKey = '';
        const priKeyHex = '';
        let priKeyDisp = '';
        let buffer = Buffer.alloc(32);        
        if (name === 'BTC' || name === 'FAB' || name === 'LTC' || name === 'DOGE' || name === 'BCH') {
            // privateKey = 'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi';
            
            // const childNode = BIP32.fromBase58(privateKey, environment.chains[name]['network']);
            const alice = Btc.ECPair.fromWIF(privateKey, environment.chains[name]['network']);
            const { address } = Btc.payments.p2pkh({
                pubkey: alice.publicKey,
                network: environment.chains[name]['network']
            });
            
            console.log('address==', address);
            if (name === 'BCH') {
                console.log('address===', address);
                addr = bchaddr.toCashAddress(address);
            } else {
                addr = address;
            }

            priKey = privateKey;
            pubKey = `0x${alice.publicKey.toString('hex')}`;

            buffer = wif.decode(priKey);
            priKeyDisp = priKey;            
        }

        const keyPairs = {
            address: addr,
            addressHash: addrHash,
            privateKey: priKey,
            privateKeyHex: priKeyHex,
            privateKeyBuffer: buffer,
            privateKeyDisplay: priKeyDisp,
            publicKey: pubKey,
            name: name,
            tokenType: ''
        };

        return keyPairs;        
    }

    getFabPrivateKey(seed) {
        const path = 'm/44\'/' + 1150 + '\'/0\'/' + 0 + '/' + 0;
        const root2 = Btc.bip32.fromSeed(seed, environment.chains['FAB']['network']);
        const childNode = root2.derivePath(path);
        return childNode.privateKey;
    }

    getKeyPairs(coin: MyCoin, seed: Buffer, chain: number, index: number) {
        const name = coin.name;

        const tokenType = coin.tokenType;
        let addr: any = '';
        let addrHash: any = '';
        let priKey: any;
        let pubKey: any = '';
        let priKeyHex: any = '';
        let priKeyDisp: any = '';
        let buffer: any = Buffer.alloc(32);

        if (!seed) {
            return {
                address: addr,
                addressHash: addrHash,
                privateKey: priKey,
                privateKeyHex: priKeyHex,
                privateKeyBuffer: buffer,
                privateKeyDisplay: priKeyDisp,
                publicKey: pubKey,
                name: name,
                tokenType: tokenType
            };
        }
        const path = 'm/44\'/' + coin.coinType + '\'/0\'/' + chain + '/' + index;

        if (name === 'BTC' || (name === 'FAB' && !tokenType) || name === 'LTC' || name === 'DOGE') {
            const root2 = Btc.bip32.fromSeed(seed, environment.chains[name]['network']);
            /*
            const childNode1 = root2.deriveHardened(44);
            const childNode2 = childNode1.deriveHardened(coin.coinType);
            const childNode3 = childNode2.deriveHardened(0);
            const childNode4 = childNode3.derive(chain);
            const childNode = childNode4.derive(index);
            */
            const childNode = root2.derivePath(path);
            const { address } = Btc.payments.p2pkh({
                pubkey: childNode.publicKey,
                network: environment.chains[name]['network']
            });
            /*
            if (name === 'BCH') {
                console.log('address===', address);
                addr = bchaddr.toCashAddress(address);
            } else {
                
            }
            */
            addr = address;
            priKey = childNode.toWIF();
            pubKey = `0x${childNode.publicKey.toString('hex')}`;

            buffer = wif.decode(priKey);
            priKeyDisp = priKey;
        } else
        if (name === 'BCH') {
            let root = bitcore.HDPrivateKey.fromSeed(seed);
            if (!environment.production) {
                root = bitcore.HDPrivateKey.fromSeed(seed, bitcore.Networks.testnet);
            }
            // tslint:disable-next-line: prefer-const
            let child = root.deriveChild(path);
            
            const publicKey = child.publicKey;  
            priKey = child.privateKey;  
 
            if (!environment.production) {
                const addrObj = bitcore.Address.fromPublicKey(publicKey, bitcore.Networks.testnet);
                addr = addrObj.toString();  
 
                const json = addrObj.toJSON();
                addrHash = json.hash;               
            } else {
                const addrObj = bitcore.Address.fromPublicKey(publicKey);
                 addr = addrObj.toString(); 
 
                 const json = addrObj.toJSON();
                 addrHash = json.hash;                
            }
        } else
        if ((name === 'ETH') || (tokenType === 'ETH') 
        || (name == 'BNB') || (tokenType == 'BNB') 
        || (name == 'HT') || (tokenType == 'HT') 
        || (name == 'MATIC') || (tokenType == 'MATIC')) {

                const root = hdkey.fromMasterSeed(seed);
                const childNode = root.derivePath(path);

                const wallet = childNode.getWallet();
                const address = `0x${wallet.getAddress().toString('hex')}`;
                addr = address;
                buffer = wallet.getPrivateKey();
                priKey = wallet.getPrivateKey();
                priKeyDisp = buffer.toString('hex');
        } else
        if (name === 'TRX' || tokenType === 'TRX') {
                const root = Btc.bip32.fromSeed(seed);
                const childNode = root.derivePath(path);
                
                // console.log('publicKey for TRX=', childNode.publicKey.toString('hex'));

                priKey = childNode.privateKey;

                buffer = wif.decode(childNode.toWIF());
                addr = 
                TronWeb.utils.crypto.getBase58CheckAddress(TronWeb.utils.crypto.getAddressFromPriKey(priKey));
        }
        else if (name === 'EX' || tokenType === 'FAB') {
                // console.log('000');
                const root = Btc.bip32.fromSeed(seed, environment.chains.BTC.network);

                // console.log('root=', root);
                const childNode = root.derivePath(path);
                // console.log('childNode=', childNode);
                const originalPrivateKey: any = childNode.privateKey;
                // console.log('111');
                priKeyHex = originalPrivateKey.toString('hex');
                priKey = childNode.toWIF();
                // console.log('333');
                priKeyDisp = priKey;
                buffer = wif.decode(priKey);
                // console.log('buffer=', buffer);
                const publicKey = childNode.publicKey;
                // console.log('publicKey=', publicKey);
                // const publicKeyString = `0x${publicKey.toString('hex')}`;
                addr = this.utilServ.toKanbanAddress(publicKey);
        }

        const keyPairs = {
            address: addr,
            addressHash: addrHash,
            privateKey: priKey,
            privateKeyHex: priKeyHex,
            privateKeyBuffer: buffer,
            privateKeyDisplay: priKeyDisp,
            publicKey: pubKey,
            name: name,
            tokenType: tokenType
        };

        return keyPairs;
    }


    signStringTron(message, privateKey) {
        message = message.replace(/^0x/, '');
        const value = {
            toHexString: function() {
                return '0x' + privateKey;
            },
            value: privateKey
        };
        console.log('message=', message);
        console.log('environment.chains.TRX.network.messagePrefix=', environment.chains.TRX.network.messagePrefix);
        const signingKey = new TronWeb.utils.ethersUtils.SigningKey(value);
        const length = message.length;
        const messageBytes = [
            ...TronWeb.utils.ethersUtils.toUtf8Bytes(environment.chains.TRX.network.messagePrefix),
            // length,
            ...TronWeb.utils.ethersUtils.toUtf8Bytes(message)
        ];

        // const messageBytes = environment.chains.TRX.network.messagePrefix + message;
        console.log('messageBytes=', messageBytes);
        const messageDigest = TronWeb.utils.ethersUtils.keccak256(messageBytes);
        console.log('messageDigest=', messageDigest);
        const signature = signingKey.signDigest(messageDigest);

        /*
        const signatureHex = [
            '0x',
            signature.r.substring(2),
            signature.s.substring(2),
            Number(signature.v).toString(16)
        ].join('');
        */
        // console.log('signatureHex=', signatureHex);
        signature.v = '0x' + Number(signature.v).toString(16);
        console.log('signature=', signature);
        return signature;
    }

    async signedMessage(originalMessage: string, keyPair: any) {
        // originalMessage = '000254cbd93f69af7373dcf5fc01372230d309684f95053c7c9cbe95cf4e4e2da731000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000a2a3720c00c2872397e6d98f41305066cbf0f8b3';
        // console.log('originalMessage=', originalMessage);
        let signature: any;
        const name = keyPair.name;
        const tokenType = keyPair.tokenType;

        console.log('in signedMessage');
        console.log('name==', name);
        console.log('tokenType==', tokenType);
        if (name === 'ETH' || tokenType === 'ETH') {
            signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
            // console.log('signature in signed is ');
            // console.log(signature);
        } else 
        if(name == 'BNB' || tokenType === 'BNB' || name == 'MATIC' || tokenType === 'MATIC' ) {
            signature = this.web3Serv.signEtheruemCompatibleMessageWithPrivateKey(originalMessage, keyPair) as Signature;
        } else
        if (name === 'TRX' || tokenType === 'TRX') {
            const priKeyDisp = keyPair.privateKey.toString('hex'); 
            signature = this.signStringTron(originalMessage, priKeyDisp);
        }
        else if ((name === 'FAB' && !tokenType) || name === 'BTC' || tokenType === 'FAB' || name === 'DOGE' || name === 'LTC') {
            // signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
            console.log('1aaa');
            let signBuffer: Buffer;
            console.log('keyPair.privateKeyBuffer.compressed===', keyPair.privateKeyBuffer.compressed);
            // if(name === 'FAB' || name === 'BTC' || tokenType === 'FAB' || name === 'LTC' || name === 'DOGE') {
            const chainName = tokenType ? tokenType : name;

            const messagePrefix = environment.chains[chainName].network.messagePrefix;

            console.log('messagePrefix=', messagePrefix);

            let v = '';
            let r = '';
            let s = '';
            /*
            console.log('2bbb');
            if((name === 'TRX' || tokenType == 'TRX')) {
                const priKeyDisp = keyPair.privateKey.toString('hex'); 
                //const signiture = TronWeb.Trx.signString(originalMessage, priKeyDisp);
                //const signiture = await tronWeb.trx.sign(originalMessage, priKeyDisp);

                const signiture = this.signStringTron(originalMessage, priKeyDisp);
                console.log('signiture=', signiture);
                r = '0x' + signiture.slice(2, 66);
                s = '0x' + signiture.slice(66, 130);
                v = '0x' + signiture.slice(130, 132);
                console.log('for trx');
                console.log(v,r,s);
            } else {
 
            }
            */
            signBuffer = bitcoinMessage.sign(originalMessage, keyPair.privateKeyBuffer.privateKey,
                keyPair.privateKeyBuffer.compressed, messagePrefix);
            v = `0x${signBuffer.slice(0, 1).toString('hex')}`;
            r = `0x${signBuffer.slice(1, 33).toString('hex')}`;
            s = `0x${signBuffer.slice(33, 65).toString('hex')}`; 

            signature = { r: r, s: s, v: v };

            console.log('signature====', signature);
        } else 
        if (name === 'BCH') {

           let signBuffer: Buffer;
           const message = new BchMessage(originalMessage);

           // var signature = message.sign(privateKey);
           
           const hash = message.magicHash();
           const ecdsa = new bitcore.crypto.ECDSA();
           ecdsa.hashbuf = hash;
           ecdsa.privkey = keyPair.privateKey;
           ecdsa.pubkey = keyPair.privateKey.toPublicKey();
           ecdsa.signRandomK();
           ecdsa.calci();
           signBuffer = ecdsa.sig.toCompact();

           console.log('signBuffer===', signBuffer);
           let v = '';
           let r = '';
           let s = '';

           v = `0x${signBuffer.slice(0, 1).toString('hex')}`;
           r = `0x${signBuffer.slice(1, 33).toString('hex')}`;
           s = `0x${signBuffer.slice(33, 65).toString('hex')}`; 

           signature = { r: r, s: s, v: v };
           // console.log('signature=', signature);

        }    

        return signature;
    }

    formCoinType(v: string, coinType: number) {
        let retString = v;
        retString = retString + this.utilServ.fixedLengh(coinType, 32 - v.length);
        return retString;
    }

    async getFabTransactionHexMultiTos (privateKey, fromAddress, tos, extraTransactionFee, 
        satoshisPerBytes, bytesPerInput) {
        let index = 0;
        let balance = 0;
        let finished = false;
        let address = '';
        let totalInput = 0;
        let transFee = 0;
        
        let amountInTx = new BigNumber(0);
        const feePerInput = bytesPerInput * satoshisPerBytes;
        const receiveAddsIndexArr: any = [];
        const changeAddsIndexArr: any = [];
        // console.log('amount111111111111=', amount);
        // console.log('extraTransactionFee=', extraTransactionFee);
        let amount = 0;
        tos.forEach(to => {
            amount += Number(to.amount);
        });
        const totalAmount = Number(amount) + Number(extraTransactionFee);
        console.log('totalAmount=', totalAmount);
        //let amountNum = new BigNumber(this.utilServ.toBigNumber(totalAmount, 8)).toNumber();
    
        let amountNum = totalAmount * 1e8;
        // console.log('amountNum=', amountNum);
        amountNum += ((tos.length + 1) * 34) * satoshisPerBytes;
        // console.log('amountNum=', amountNum);
        // const TestNet = Btc.networks.testnet;
        const network = environment.production ? Btc.networks.bitcoin : Btc.networks.testnet;
    
        const txb = new Btc.TransactionBuilder(network);
        // console.log('amountNum=', amountNum);
        let txHex = '';
    
        const fabUtxos = await this.apiService.getFabUtxos(fromAddress);
    
        if (fabUtxos && fabUtxos.length) {
            // console.log('fabUtxos=', fabUtxos);
            // console.log('fabUtxos.length=', fabUtxos.length);
            for (let i = 0; i < fabUtxos.length; i++) {

                console.log('i=', i);
                const utxo = fabUtxos[i];
                const idx = utxo.idx;
    
                const txidItem = {
                    txid: utxo.txid,
                    idx: idx
                };
    
    
                let existed = false;
                for(let iii = 0; iii < this.txids.length; iii++) {
                    const ttt = this.txids[iii];
                    if((ttt.txid == txidItem.txid) && (ttt.idx == txidItem.idx)) {
                        existed = true;
                        console.log('existed');
                        break;
                    }
                }
    
                if(existed) {
                    continue;
                }
    
                console.log('push one');
                this.txids.push(txidItem);
    
                txb.addInput(utxo.txid, idx);
                // console.log('input is');
                // console.log(utxo.txid, utxo.idx, utxo.value);
                receiveAddsIndexArr.push(index);
                totalInput += utxo.value;
                // console.log('totalInput here=', totalInput);
                amountNum -= utxo.value;
                amountNum += feePerInput;
                if (amountNum <= 0) {
                    finished = true;
                    break;
                }                 
            }    
        }
       
        // console.log('totalInput here 2=', totalInput);
        if (!finished) {
            // console.log('not enough fab coin to make the transaction.');
            return {txHex: '', errMsg: 'not enough fab coin to make the transaction.', transFee: 0, txids: this.txids};
        }
    
    
        const changeAddress = fromAddress;
    
        let outputNum = (tos.length + 1);
    
        transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34) * satoshisPerBytes;
    
        const output1 = Math.round(totalInput
        - (amount + extraTransactionFee) * 1e8
        - transFee);
           
        //const output2 = Math.round(amount * 1e8);    

        if (output1 < 0) {
            // console.log('output1 or output2 should be greater than 0.');
            return {txHex: '', 
            errMsg: 'output1 should be greater than 0.' + totalInput + ',' + amount + ',' + transFee + ',' + output1, 
            transFee: 0, amountInTx: amountInTx, txids: this.txids};
        }
    
    
        txb.addOutput(changeAddress, output1);
        tos.forEach(to => {
            const output2 = new BigNumber(to.amount).multipliedBy(new BigNumber(1e8));
            amountInTx = output2;
            txb.addOutput(to.address, Number(output2.toFixed()));
        });

        for (index = 0; index < receiveAddsIndexArr.length; index ++) {
            //const alice = Btc.ECPair.fromPrivateKey(privateKey, { network: network });
            const alice = Btc.ECPair.fromWIF(privateKey, network);
            txb.sign(index, alice);                
        }
           
        txHex = txb.build().toHex();
        return {txHex: txHex, errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: this.txids};
    }

    async getFabTransactionHex(seed: any, mycoin: MyCoin, to: any, amount: number, extraTransactionFee: number,
        satoshisPerBytes: number, bytesPerInput: number, getTransFeeOnly: boolean) {

        extraTransactionFee = Number(extraTransactionFee);
        amount = Number(amount);
        let index: any = 0;
        let finished: any = false;
        let address: any = '';
        let totalInput: any = 0;
        let transFee: any = 0;
        let amountInTx: any = new BigNumber(0);
        const txids: any = [];
        const feePerInput: any = bytesPerInput * satoshisPerBytes;
        const receiveAddsIndexArr: any = [];
        const changeAddsIndexArr: any = [];
        // console.log('amount111111111111=', amount);
        // console.log('extraTransactionFee=', extraTransactionFee);
        const totalAmount = Number(amount) + Number(extraTransactionFee);
        // console.log('totalAmount=', totalAmount);
        let amountNum = new BigNumber(this.utilServ.toBigNumber(totalAmount, 8)).toNumber();
        // console.log('amountNum=', amountNum);
        amountNum += (2 * 34) * satoshisPerBytes;
        // console.log('amountNum=', amountNum);
        // const TestNet = Btc.networks.testnet;
        const network = environment.chains.BTC.network;

        const txb = new Btc.TransactionBuilder(network);
        // console.log('amountNum=', amountNum);
        let txHex = '';

        //console.log('mycoin.receiveAdds=', mycoin.receiveAdds);

        for (index = 0; index < mycoin.receiveAdds.length; index++) {

            address = mycoin.receiveAdds[index].address;
            // console.log('address in getFabTransactionHex=' + address);
            let fabUtxos = await this.apiService.getFabUtxos(address);
            //fabUtxos = fabUtxos.sort ((a, b) => b.value - a.value);
            this.utilServ.shuffleArray(fabUtxos);
            //console.log('fabUtxos after ssorted =', fabUtxos);
            if (fabUtxos && fabUtxos.length) {
                // console.log('fabUtxos=', fabUtxos);
                // console.log('fabUtxos.length=', fabUtxos.length);
                for (let i = 0; i < fabUtxos.length; i++) {
                    const utxo = fabUtxos[i];
                    const idx = utxo.idx;
                    /*
                    const isLocked = await this.apiService.isFabTransactionLocked(utxo.txid, idx);
                    if (isLocked) {
                        continue;
                    }
                    */

                    const txidItem = {
                        txid: utxo.txid,
                        idx: idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                            console.log('continueeee');
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(utxo.txid, idx);
                    // console.log('input is');
                    // console.log(utxo.txid, utxo.idx, utxo.value);
                    receiveAddsIndexArr.push(index);
                    totalInput += utxo.value;
                    // console.log('totalInput here=', totalInput);
                    amountNum -= utxo.value;
                    amountNum += feePerInput;
                    if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {
                        finished = true;
                        break;
                    }
                }
            }
            if (finished) {
                break;
            }
        }

        // console.log('totalInput here 1=', totalInput);

        if (!finished) {
            for (index = 0; index < mycoin.changeAdds.length; index++) {

                address = mycoin.changeAdds[index].address;

                const fabUtxos = await this.apiService.getFabUtxos(address);

                if (fabUtxos && fabUtxos.length) {
                    for (let i = 0; i < fabUtxos.length; i++) {
                        const utxo = fabUtxos[i];
                        const idx = utxo.idx;

                        /*
                        const isLocked = await this.apiService.isFabTransactionLocked(utxo.txid, idx);
                        if (isLocked) {
                            continue;
                        }      
                        */

                        const txidItem = {
                            txid: utxo.txid,
                            idx: idx
                        };

                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                                console.log('continueeee');
                                existed = true;
                                break;
                            }
                        }

                        if (existed) {
                            continue;
                        }
                        txids.push(txidItem);

                        txb.addInput(utxo.txid, idx);
                        // console.log('input is');
                        // console.log(utxo.txid, utxo.idx, utxo.value);
                        receiveAddsIndexArr.push(index);
                        totalInput += utxo.value;
                        // console.log('totalInput here=', totalInput);
                        amountNum -= utxo.value;
                        amountNum += feePerInput;
                        if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {
                            finished = true;
                            break;
                        }
                    }
                }
                if (finished) {
                    break;
                }
            }
        }
        // console.log('totalInput here 2=', totalInput);
        if ((amount > 0) && !finished) {
            // console.log('not enough fab coin to make the transaction.');
            return { txHex: '', errMsg: 'not enough fab coin to make the transaction.', transFee: 0, txids: txids };
        }

        const changeAddress = mycoin.receiveAdds[0];

        let outputNum = 2;
        if ((mycoin.tokenType === '') && (amount === 0)) {
            outputNum = 1;
        }
        transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34) * satoshisPerBytes;

        const output1 = Math.round(totalInput
         //   - new BigNumber(this.utilServ.toBigNumber(amount + extraTransactionFee, 8)).toNumber()
            - (amount + extraTransactionFee) * 1e8
            - transFee);

        if (getTransFeeOnly) {
            return { txHex: '', errMsg: '', transFee: transFee + new BigNumber(this.utilServ.toBigNumber(extraTransactionFee, 8)).toNumber(), amountInTx: amountInTx };
        }
        // const output2 = Math.round(amount * 1e8);    
        const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
        amountInTx = output2;
        if (output1 < 0) {
            // console.log('output1 or output2 should be greater than 0.');
            return {
                txHex: '',
                errMsg: 'Not enough Utxos, please wait a few minutes and try again.',
                //errMsg: 'output1 1 should be greater than 0.' + totalInput + ',' + amount + ',' + transFee + ',' + output1,
                transFee: 0, amountInTx: amountInTx, txids: txids
            };
        }
        // console.log('amount=' + amount + ',totalInput=' + totalInput);
        // console.log('defaultTransactionFee=' + extraTransactionFee);
        // console.log('(receiveAddsIndexArr.length + changeAddsIndexArr.length) * feePerInput)=' 
        // + (receiveAddsIndexArr.length + changeAddsIndexArr.length) * feePerInput);
        // console.log('output1=' + output1 + ',output2=' + output2);

        if ((amount > 0) || (mycoin.tokenType === 'FAB')) {

            txb.addOutput(changeAddress.address, output1);
            txb.addOutput(to, output2.toNumber());
        } else {
            txb.addOutput(to, output1);
        }

        for (index = 0; index < receiveAddsIndexArr.length; index++) {
            const keyPair = this.getKeyPairs(mycoin, seed, 0, receiveAddsIndexArr[index]);
            // console.log('keyPair.privateKey=' + keyPair.privateKey + ',keyPair.publicKey=' + keyPair.publicKey);
            // console.log('receiveAddsIndexArr[index]=' + receiveAddsIndexArr[index] + ',address for keypair=' + keyPair.address);
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, network);
            txb.sign(index, alice);
        }

        for (index = 0; index < changeAddsIndexArr.length; index++) {
            const keyPair = this.getKeyPairs(mycoin, seed, 1, changeAddsIndexArr[index]);
            // console.log('changeAddsIndexArr[index]=' + changeAddsIndexArr[index] + 'address for keypair=' + keyPair.address);
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, network);
            txb.sign(receiveAddsIndexArr.length + index, alice);
        }

        txHex = txb.build().toHex();
        return { txHex: txHex, errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
    }

    async getFabTransactionHexWithPrivateKey(privateKey: string, mycoin: MyCoin, to: any, amount: number, extraTransactionFee: number,
        satoshisPerBytes: number, bytesPerInput: number, getTransFeeOnly: boolean) {

        extraTransactionFee = Number(extraTransactionFee);
        amount = Number(amount);
        let index: any = 0;
        let finished: any = false;
        let address: any = '';
        let totalInput: any = 0;
        let transFee: any = 0;
        let amountInTx: any = new BigNumber(0);
        const txids: any = [];
        const feePerInput: any = bytesPerInput * satoshisPerBytes;
        const receiveAddsIndexArr: any = [];
        const changeAddsIndexArr: any = [];
        // console.log('amount111111111111=', amount);
        // console.log('extraTransactionFee=', extraTransactionFee);
        const totalAmount: any = Number(amount) + Number(extraTransactionFee);
        // console.log('totalAmount=', totalAmount);
        let amountNum: any = new BigNumber(this.utilServ.toBigNumber(totalAmount, 8)).toNumber();
        // console.log('amountNum=', amountNum);
        amountNum += (2 * 34) * satoshisPerBytes;
        // console.log('amountNum=', amountNum);
        // const TestNet = Btc.networks.testnet;
        const network: any = environment.chains.BTC.network;

        const txb: any = new Btc.TransactionBuilder(network);
        // console.log('amountNum=', amountNum);
        let txHex: any = '';

        for (index = 0; index < mycoin.receiveAdds.length; index++) {

            address = mycoin.receiveAdds[index].address;
            // console.log('address in getFabTransactionHex=' + address);
            const fabUtxos = await this.apiService.getFabUtxos(address);

            if (fabUtxos && fabUtxos.length) {
                // console.log('fabUtxos=', fabUtxos);
                // console.log('fabUtxos.length=', fabUtxos.length);
                for (let i = 0; i < fabUtxos.length; i++) {
                    const utxo = fabUtxos[i];
                    const idx = utxo.idx;
                    /*
                    const isLocked = await this.apiService.isFabTransactionLocked(utxo.txid, idx);
                    if (isLocked) {
                        continue;
                    }
                    */

                    const txidItem = {
                        txid: utxo.txid,
                        idx: idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                            console.log('continueeee');
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(utxo.txid, idx);

                    console.log('input is');
                    console.log(utxo.txid, utxo.idx, utxo.value);
                    receiveAddsIndexArr.push(index);
                    totalInput += utxo.value;
                    // console.log('totalInput here=', totalInput);
                    amountNum -= utxo.value;
                    amountNum += feePerInput;
                    if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {
                        finished = true;
                        break;
                    }
                }
            }
            if (finished) {
                break;
            }
        }


        // console.log('totalInput here 2=', totalInput);
        if ((amount > 0) && !finished) {
            // console.log('not enough fab coin to make the transaction.');
            return { txHex: '', errMsg: 'not enough fab coin to make the transaction.', transFee: 0, txids: txids };
        }

        const changeAddress = mycoin.receiveAdds[0];

        let outputNum = 2;
        if ((mycoin.tokenType === '') && (amount === 0)) {
            outputNum = 1;
        }
        transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34) * satoshisPerBytes;

        const output1 = Math.round(totalInput
//            - new BigNumber(this.utilServ.toBigNumber(amount + extraTransactionFee, 8)).toNumber()
            - (amount + extraTransactionFee) * 1e8
            - transFee);

        if (getTransFeeOnly) {
            return { txHex: '', errMsg: '', transFee: transFee + new BigNumber(this.utilServ.toBigNumber(extraTransactionFee, 8)).toNumber(), amountInTx: amountInTx };
        }
        // const output2 = Math.round(amount * 1e8);    
        const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
        amountInTx = output2;
        if (output1 < 0) {
            // console.log('output1 or output2 should be greater than 0.');
            return {
                txHex: '',
                errMsg: 'output1 should be greater than 0,' + totalInput + ',' + amount + ',' + transFee 
                + ',' + output1 + ',' + extraTransactionFee,
                transFee: 0, amountInTx: amountInTx, txids: txids
            };
        }
        // console.log('amount=' + amount + ',totalInput=' + totalInput);
        // console.log('defaultTransactionFee=' + extraTransactionFee);
        // console.log('(receiveAddsIndexArr.length + changeAddsIndexArr.length) * feePerInput)=' 
        // + (receiveAddsIndexArr.length + changeAddsIndexArr.length) * feePerInput);
        

        if ((amount > 0) || (mycoin.tokenType === 'FAB')) {

            txb.addOutput(changeAddress.address, output1);
            txb.addOutput(to, output2.toNumber());
            console.log('changeAddress.address=' + changeAddress.address + ',to=' + to);
            console.log('output1=' + output1 + ',output2=' + output2.toNumber());
        } else {
            txb.addOutput(to, output1);
        }

        for (index = 0; index < receiveAddsIndexArr.length; index++) {
           // console.log('receiveAddsIndexArr[index]=' + receiveAddsIndexArr[index] + ',address for keypair=' + keyPair.address);
            const alice = Btc.ECPair.fromWIF(privateKey, network);
            txb.sign(index, alice);
        }

        txHex = txb.build().toHex();
        return { txHex: txHex, errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
    }

    getOriginalMessage(coinType: number, txHash: string, amount: BigNumber, address: string) {

        let buf = '';
        const coinTypeHex = coinType.toString(16);

        buf += this.utilServ.fixedLengh(coinTypeHex, 8);

        
        buf += this.utilServ.fixedLengh(txHash, 64);
        const hexString = amount.toString(16);
        buf += this.utilServ.fixedLengh(hexString, 64);
        buf += this.utilServ.fixedLengh(address, 64);

        return buf;
    }

    getCoinTypePrefix(coin: MyCoin): number {
        console.log('coin===', coin);
        let prefix = 0;
        if (coin.name === 'USDT') {
            if (coin.tokenType === 'ETH') {
                prefix = 3;
            } else 
            if (coin.tokenType === 'TRX') {
                prefix = 7;
            }
            if (coin.tokenType === 'BNB') {
                prefix = 8;
            } else
            if (coin.tokenType === 'MATIC') {
                prefix = 9;
            }           
        } else 
        if (coin.name === 'FAB') {
            if (coin.tokenType === 'ETH') {
                prefix = 3;
            }    
            if (coin.tokenType === 'BNB') {
                prefix = 8;
            }          
        } else
        if (['EXG', 'DSC', 'BST'].indexOf(coin.name) >= 0) {
            if (coin.tokenType === 'ETH') {
                prefix = 3;
            } else
            if (coin.tokenType === 'FAB') {
                prefix = 2;
            }          
        } else 
        if(coin.name == 'MATIC') {
            if(!coin.tokenType) {
                prefix = 9;
            }
        }
        
        return prefix;
    }

    getUpdatedCoinType(coin: MyCoin): number {
        let name = coin.name.toUpperCase();
        const tokenType = coin.tokenType;
        if (name === 'USDT' && tokenType === 'TRX') {
            name = 'USDTX';
        } else 
        if (name === 'USDT' && tokenType === 'BNB') {
            name = 'USDTB';
        } else 
        if (name === 'USDT' && tokenType === 'MATIC') {
            name = 'USDTM';
        } else
        if (name === 'FAB' && tokenType === 'ETH') {
            name = 'FABE';
        } else 
        if (name === 'FAB' && tokenType === 'BNB') {
            name = 'FABB';
        } else 
        if (name === 'EXG' && tokenType === 'ETH') {
            name = 'EXGE';
        } else 
        if (name === 'DSC' && tokenType === 'ETH') {
            name = 'DSCE';
        } else 
        if (name === 'BST' && tokenType === 'ETH') {
            name = 'BSTE';
        } else
        if (name === 'MATIC' && !tokenType) {
            name = 'MATICM'
        }
        for (let i = 0; i < coin_list.length; i++) {
            const coin2 = coin_list[i];
            if (coin2.name === name) {
                return coin2.id;
            }
        }
        return -1;
    }

    async sendTransactionWithPrivateKey(mycoin: MyCoin, privateKey: string, toAddress: string, amount: number,
        options: any, doSubmit: boolean) {
            console.log('begin sendTransactionWithPrivateKey');
            let index: any = 0;
            let finished: any = false;
            let address: any = '';
            let totalInput: any = 0;
    
            let gasPrice: any = 0;
            let gasLimit: any = 0;
            let satoshisPerBytes: any = 0;
            let bytesPerInput: any = 0;
            let txHex: any = '';
            let txHash: any = '';
            let errMsg: any = '';
            let transFee: any = 0;
            let txids: any = [];
            let dustAmount: any = 2730;
            if (mycoin.name === 'DOGE') {
                dustAmount = 100000000;
            }
            let amountInTx: any = new BigNumber(0);
            // console.log('options=', options);
            let getTransFeeOnly: any = false;
            
            if (options) {
                if (options.gasPrice) {
                    gasPrice = options.gasPrice;
                }
                if (options.gasLimit) {
                    gasLimit = options.gasLimit;
                }
                if (options.satoshisPerBytes) {
                    satoshisPerBytes = options.satoshisPerBytes;
                }
                if (options.bytesPerInput) {
                    bytesPerInput = options.bytesPerInput;
                }
                if (options.getTransFeeOnly) {
                    getTransFeeOnly = options.getTransFeeOnly;
                }
            }

            const receiveAddsIndexArr: any = [];
            let amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, this.utilServ.getDecimal(mycoin))));
            // it's for all coins.
            amountNum = amountNum.plus((2 * 34) * satoshisPerBytes);
            if (mycoin.name === 'BTC' || mycoin.name === 'LTC' || mycoin.name === 'DOGE' || mycoin.name === 'BCH') { // btc address format
                if (mycoin.name === 'BCH') {
                    toAddress = bchaddr.toLegacyAddress(toAddress);
                }
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains[mycoin.name].satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains[mycoin.name].bytesPerInput;
                }
                const BtcNetwork = environment.chains[mycoin.name].network;
                const txb = new Btc.TransactionBuilder(BtcNetwork);
                console.log('mycoin.receiveAdds=', mycoin.receiveAdds);
                for (index = 0; index < mycoin.receiveAdds.length; index++) {

                    address = mycoin.receiveAdds[index].address;
                    const balanceFull = await this.apiService.getUtxos(mycoin.name, address);
                    console.log('balanceFull==', balanceFull);
                    for (let i = 0; i < balanceFull.length; i++) {
                        const tx = balanceFull[i];
                        // console.log('i=' + i);
                        // console.log(tx);
                        if (tx.idx < 0) {
                            continue;
                        }
    
                        const txidItem = {
                            txid: tx.txid,
                            idx: tx.idx
                        };
    
                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                                existed = true;
                                break;
                            }
                        }
    
                        if (existed) {
                            continue;
                        }
    
                        txids.push(txidItem);
    
                        txb.addInput(tx.txid, tx.idx);
                        amountNum = amountNum.minus(tx.value);
                        amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                        totalInput += tx.value;
                        receiveAddsIndexArr.push(index);
                        if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                            finished = true;
                            break;
                        }
                    }
                    if (finished) {
                        break;
                    }
                }

                if ((amount > 0) && !finished) {
                    txHex = '';
                    txHash = '';
                    errMsg = 'not enough fund.';
                    console.log('not enough fund.');
                    return { txHex: txHex, txHash: txHash, errMsg: errMsg, amountInTx: amountInTx, txids: txids };
                }
    
                let outputNum = 2;
                if (amount === 0) {
                    outputNum = 1;
                }
    
                transFee = ((receiveAddsIndexArr.length) * bytesPerInput + outputNum * 34 + 10) * satoshisPerBytes;
    
                const changeAddress = mycoin.receiveAdds[0];
                // console.log('totalInput=' + totalInput);
                // console.log('amount=' + amount);
                // console.log('transFee=' + transFee);
                const output1 = Math.round(new BigNumber(totalInput - new BigNumber(amount).multipliedBy(new BigNumber(1e8)).toNumber() - transFee).toNumber());
    
                if (output1 < dustAmount) {
                    transFee += output1;
                }
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();
    
                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }
                // const output2 = Math.round(new BigNumber(amount * 1e8).toNumber());  
    
                console.log('amountttttt=', amount);
                const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
                console.log('this.utilServ.toBigNumber(amount, 8)=', this.utilServ.toBigNumber(amount, 8));
    
                console.log('output1=', output1);
                amountInTx = output2;
                if (amount > 0) {
                    if (output1 >= dustAmount) {
                        txb.addOutput(changeAddress.address, output1);
                    }
                    txb.addOutput(toAddress, output2.toNumber());
                } else {
                    console.log('go amount = 0');
                    txb.addOutput(toAddress, output1);
                }
    
                for (index = 0; index < receiveAddsIndexArr.length; index++) {
                    const alice = Btc.ECPair.fromWIF(privateKey, BtcNetwork);
                    txb.sign(index, alice);
                }

                txHex = txb.build().toHex();
                // console.log('doSubmit=', doSubmit);
                if (doSubmit) {
                    // console.log('1');
                    const res = await this.apiService.postTx(mycoin.name, txHex);
                    txHash = res.txHash;
                    errMsg = res.errMsg;
                    // console.log(txHash);
    
                } else {
                    // console.log('2');
                    const tx = Btc.Transaction.fromHex(txHex);
                    txHash = '0x' + tx.getId();
                    // console.log(txHash);
                }
            }    
            
            else if (mycoin.name === 'FAB') {
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains.FAB.bytesPerInput;
                }

                const res1 = await this.getFabTransactionHexWithPrivateKey(privateKey, mycoin, toAddress, amount, 0,
                    satoshisPerBytes, bytesPerInput, getTransFeeOnly);
                console.log('res1=', res1);
                txHex = res1.txHex;
                errMsg = res1.errMsg;
                transFee = res1.transFee;
                amountInTx = res1.amountInTx;
                txids = res1.txids;
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx };
                }

                if (!errMsg && txHex) {
                    if (doSubmit) {
                        const res = await this.apiService.postFabTx(txHex);
                        txHash = res.txHash;
                        errMsg = res.errMsg;
                    } else {
                        const tx = Btc.Transaction.fromHex(txHex);
                        txHash = '0x' + tx.getId();
                    }
                }

            }     
            
            else if (mycoin.tokenType === 'FAB') {
                if (!gasPrice) {
                    gasPrice = environment.chains.FAB.gasPrice;
                }
                if (!gasLimit) {
                    gasLimit = environment.chains.FAB.gasLimit;
                }
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains.FAB.bytesPerInput;
                }
                console.log('gasPrice final=', gasPrice);
                let decimals = mycoin.decimals;
                if (!decimals) {
                    decimals = 18;
                }
                // const amountSent = BigInt(amount * Math.pow(10, decimals));
                // const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                const amountSent = this.utilServ.toBigNumber(amount, decimals);
                // const abiHex = this.web3Serv.getFabTransferABI([toAddress, amountSent.toString()]);

                const funcTransfer: any = {
                    'constant': false,
                    'inputs': [
                        {
                            'name': 'to',
                            'type': 'address'
                        },
                        {
                            'name': 'value',
                            'type': 'uint256'
                        }
                    ],
                    'name': 'transfer',
                    'outputs': [
                        {
                            'name': '',
                            'type': 'bool'
                        }
                    ],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                };
                // console.log('foreeeee');
                console.log('amountSent=', amountSent);
                console.log('toAddress===', toAddress);
                amountInTx = new BigNumber(amountSent);
                let fxnCallHex = this.web3Serv.getGeneralFunctionABI(funcTransfer, [toAddress, amountSent]);
                // console.log('enddddd');
                fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);
                let contractAddress = mycoin.contractAddr;
                if (mycoin.name === 'EXG') {
                    contractAddress = environment.addresses.smartContract.EXG.FAB;
                } else if (mycoin.name === 'DUSD') {
                    contractAddress = environment.addresses.smartContract.DUSD;
                }

                // const keyPair = this.getKeyPairs(mycoin, seed, 0, 0);

                // contractAddress = '0x28a6efffaf9f721a1e95667e3de54c622edc5ffa';
                contractAddress = this.utilServ.stripHexPrefix(contractAddress);
                // console.log('contractAddress=' + contractAddress);

                const totalAmount = gasLimit * gasPrice / 1e8;
                console.log('totalAmount==', totalAmount);
                // let cFee = 3000 / 1e8 // fee for the transaction

                // console.log('fxnCallHex=' + fxnCallHex);
                let totalFee = totalAmount;
                const contract = Btc.script.compile([
                    84,
                    this.utilServ.number2Buffer(gasLimit),
                    this.utilServ.number2Buffer(gasPrice),
                    this.utilServ.hex2Buffer(fxnCallHex),
                    this.utilServ.hex2Buffer(contractAddress),
                    194
                ]);

                // console.log('contract=====', contract);
                const contractSize = contract.toJSON.toString().length;

                // console.log('contractSize=' + contractSize);
                totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

               const baseCoin = mycoin.baseCoin;
                baseCoin.tokenType = 'FAB';
                console.log('totalFee==', totalFee);
                const res1 = await this.getFabTransactionHexWithPrivateKey(privateKey, baseCoin, contract, 0, totalFee,
                    satoshisPerBytes, bytesPerInput, getTransFeeOnly);

                baseCoin.tokenType = '';
                // console.log('res1=', res1);
                txHex = res1.txHex;
                errMsg = res1.errMsg;
                transFee = res1.transFee;
                txids = res1.txids;
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }

                if (txHex) {
                    if (doSubmit) {
                        const res = await this.apiService.postFabTx(txHex);
                        txHash = res.txHash;
                        errMsg = res.errMsg;
                    } else {
                        const tx = Btc.Transaction.fromHex(txHex);
                        txHash = '0x' + tx.getId();
                    }
                }
            }
            
            const ret = { txHex: txHex, txHash: txHash, errMsg: errMsg, transFee: transFee, amountInTx: amountInTx, txids: txids };
            console.log('ret there from sendTransactionInPrivateKey=', ret);
            return ret;
    }

    async sendTransaction(mycoin: MyCoin, seed: Buffer, toAddress: string, amount: number,
        options: any, doSubmit: boolean) {

        let index: any = 0;
        let finished: any = false;
        let address: any = '';
        let totalInput: any = 0;

        let gasPrice: any = 0;
        let gasLimit: any = 0;
        let satoshisPerBytes: any = 0;
        let bytesPerInput: any = 0;
        let txHex: any = '';
        let txHash: any = '';
        let errMsg: any = '';
        let transFee: any = 0;
        let txids: any = [];
        let dustAmount: any = 2730;
        if (mycoin.name === 'DOGE') {
            dustAmount = 100000000;
        }
        let amountInTx: any = new BigNumber(0);
        // console.log('options=', options);
        let getTransFeeOnly: any = false;
        if (options) {
            //console.log('optionsoptionsoptions=', options);
            if (options.gasPrice) {
                gasPrice = options.gasPrice;
            }
            if (options.gasLimit) {
                gasLimit = options.gasLimit;
            }
            if (options.satoshisPerBytes) {
                satoshisPerBytes = options.satoshisPerBytes;
            }
            if (options.bytesPerInput) {
                bytesPerInput = options.bytesPerInput;
            }
            if (options.getTransFeeOnly) {
                getTransFeeOnly = options.getTransFeeOnly;
            }
        }
        const receiveAddsIndexArr: any = [];
        const changeAddsIndexArr: any = [];

        // console.log('mycoin=');
        // console.log(mycoin);

        // let amountNum = amount * Math.pow(10, this.utilServ.getDecimal(mycoin));
        let amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, this.utilServ.getDecimal(mycoin))));
        // it's for all coins.
        amountNum = amountNum.plus((2 * 34) * satoshisPerBytes);
        // 2 output
        // console.log('toAddress=' + toAddress + ',amount=' + amount + ',amountNum=' + amountNum);

        if (mycoin.name === 'BTC' || mycoin.name === 'LTC' || mycoin.name === 'DOGE') { // btc address format

            if (!satoshisPerBytes) {
                satoshisPerBytes = environment.chains[mycoin.name].satoshisPerBytes;
            }
            if (!bytesPerInput) {
                bytesPerInput = environment.chains[mycoin.name].bytesPerInput;
            }
            const BtcNetwork = environment.chains[mycoin.name].network;
            const txb = new Btc.TransactionBuilder(BtcNetwork);

            for (index = 0; index < mycoin.receiveAdds.length; index++) {

                address = mycoin.receiveAdds[index].address;
                let balanceFull = await this.apiService.getUtxos(mycoin.name, address);
                this.utilServ.shuffleArray(balanceFull);
                for (let i = 0; i < balanceFull.length; i++) {
                    const tx = balanceFull[i];
                    if (tx.idx < 0) {
                        continue;
                    }

                    const txidItem = {
                        txid: tx.txid,
                        idx: tx.idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(tx.txid, tx.idx);
                    
                    amountNum = amountNum.minus(tx.value);
                    amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                    totalInput += tx.value;
                    receiveAddsIndexArr.push(index);
                    if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                        finished = true;
                        break;
                    }
                }
                if (finished) {
                    break;
                }
            }
            if (!finished) {
                for (index = 0; index < mycoin.changeAdds.length; index++) {
                    /*
                    balance = mycoin.changeAdds[index].balance;
                    if (balance <= 0) {
                        continue;
                    }
                    */
                    address = mycoin.changeAdds[index].address;
                    const balanceFull = await this.apiService.getBtcUtxos(address);
                    for (let i = 0; i < balanceFull.length; i++) {
                        const tx = balanceFull[i];
                        // console.log('i=' + i);
                        // console.log(tx);
                        if (tx.idx < 0) {
                            continue;
                        }

                        const txidItem = {
                            txid: tx.txid,
                            idx: tx.idx
                        };
                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                                console.log('continueeee');
                                existed = true;
                                break;
                            }
                        }

                        if (existed) {
                            continue;
                        }
                        txids.push(txidItem);

                        txb.addInput(tx.txid, tx.idx);
                        amountNum = amountNum.minus(tx.value);
                        amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                        totalInput += tx.value;
                        changeAddsIndexArr.push(index);

                        if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                            finished = true;
                            break;
                        }
                    }
                    if (finished) {
                        break;
                    }
                }
            }

            if ((amount > 0) && !finished) {
                txHex = '';
                txHash = '';
                errMsg = 'not enough fund.';
                return { txHex: txHex, txHash: txHash, errMsg: errMsg, amountInTx: amountInTx, txids: txids };
            }

            let outputNum = 2;
            if (amount === 0) {
                outputNum = 1;
            }

            transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34 + 10) * satoshisPerBytes;

            const changeAddress = mycoin.receiveAdds[0];
            // console.log('totalInput=' + totalInput);
            // console.log('amount=' + amount);
            // console.log('transFee=' + transFee);
            const output1 = Math.round(new BigNumber(totalInput - new BigNumber(amount).multipliedBy(new BigNumber(1e8)).toNumber() - transFee).toNumber());

            if (output1 < dustAmount) {
                transFee += output1;
            }
            transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

            if (getTransFeeOnly) {
                return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
            }
            // const output2 = Math.round(new BigNumber(amount * 1e8).toNumber());  

            //console.log('amountttttt=', amount);
            const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
            //console.log('this.utilServ.toBigNumber(amount, 8)=', this.utilServ.toBigNumber(amount, 8));

            //console.log('output1=', output1);
            amountInTx = output2;
            if (amount > 0) {
                if (output1 >= dustAmount) {
                    const myChangeAddress = changeAddress.address;
                    /*
                    if (mycoin.name === 'BCH') {
                        myChangeAddress = bchaddr.toLegacyAddress(myChangeAddress);
                    }   
                    */                
                    txb.addOutput(myChangeAddress, output1);
                }
                txb.addOutput(toAddress, output2.toNumber());
            } else {
                console.log('go amount = 0');
                txb.addOutput(toAddress, output1);
            }

            for (index = 0; index < receiveAddsIndexArr.length; index++) {
                const keyPair = this.getKeyPairs(mycoin, seed, 0, receiveAddsIndexArr[index]);
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, BtcNetwork);
                txb.sign(index, alice);
            }

            for (index = 0; index < changeAddsIndexArr.length; index++) {
                const keyPair = this.getKeyPairs(mycoin, seed, 1, changeAddsIndexArr[index]);
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, BtcNetwork);
                txb.sign(receiveAddsIndexArr.length + index, alice);
            }

            txHex = txb.build().toHex();
            // console.log('doSubmit=', doSubmit);
            if (doSubmit) {
                // console.log('1');
                const res = await this.apiService.postTx(mycoin.name, txHex);
                txHash = res.txHash;
                errMsg = res.errMsg;
                // console.log(txHash);

            } else {
                // console.log('2');
                const tx = Btc.Transaction.fromHex(txHex);
                txHash = '0x' + tx.getId();
                // console.log(txHash);
            }
        } else

        if (mycoin.name === 'BCH') {
            console.log('BCH there we go');

            /*
            var privateKey1 = new bitcore.PrivateKey('L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy');
            var utxo = {
              "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
              "outputIndex" : 0,
              "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
              "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
              "satoshis" : 50000
            };
            
            var transaction = new bitcore.Transaction()
              .from(utxo)
              .to('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
              .sign(privateKey1);


            console.log('end here');
            */

            if (!satoshisPerBytes) {
                satoshisPerBytes = environment.chains.BCH.satoshisPerBytes;
            }
            if (!bytesPerInput) {
                bytesPerInput = environment.chains.BCH.bytesPerInput;
            }               
            const keyPair = this.getKeyPairs(mycoin, seed, 0, 0);
            console.log('keyPair==', keyPair);
            const address2 = mycoin.receiveAdds[0].address;
            const privateKey = keyPair.privateKey;
            const balanceFull = await this.apiService.getBchUtxos(address2);
            const utxos: any = [];
            totalInput = 0;
            for (let i = 0; i < balanceFull.length; i++) {
                const tx = balanceFull[i];
                // console.log('i=' + i);
                // console.log(tx);
                if (tx.idx < 0) {
                    continue;
                }
                const addrString = tx.address;
                const addr = bitcore.Address.fromString(addrString);
                const utxo = {
                    txId : tx.txid,
                    outputIndex : tx.idx,
                    address : addrString,
                    'script' : new bitcore.Script(addr).toHex(),
                    'satoshis' : tx.value
                };
                totalInput += tx.value;
                utxos.push(utxo);
                amountNum = amountNum.minus(tx.value);
                if (amountNum.isLessThanOrEqualTo(0)) {
                    finished = true;
                    break;
                }
            }  
            if (!finished) {
                txHex = '';
                txHash = '';
                errMsg = 'not enough fund.';
                return {txHex: txHex, txHash: txHash, errMsg: errMsg};
            }
            //console.log('amount==', amount);
            const outputNum = 2;
            transFee = ((utxos.length) * bytesPerInput + outputNum * 34 + 10) * satoshisPerBytes;
            const transFeeSatoshis = transFee;
            transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();
            if (getTransFeeOnly) {
                return {txHex: '', txHash: '', errMsg: '', transFee: transFee};
            }  
            // console.log('totalInput=' + totalInput);
            // console.log('amount=' + amount);
            const output1 = Math.round(new BigNumber(totalInput - amount * 1e8 - transFee).toNumber());

            const amountBigNum = new BigNumber(this.utilServ.toBigNumber(amount, 8));
            amountInTx = amountBigNum;
            const transaction = new bitcore.Transaction()
            .from(utxos)          // Feed information about what unspent outputs one can use
            .fee(transFeeSatoshis)
            // .enableRBF()            
            .to(toAddress, amountBigNum.toNumber())  // Add an output with the given amount of satoshis
            .change(address)      // Sets up a change address where the rest of the funds will go
            .sign(privateKey);     // Signs all the inputs it can
        
            txHex = transaction.serialize();  
            
            if (doSubmit) {
                // console.log('1');
                const res = await this.apiService.postBchTx(txHex);
                txHash = res.txHash;
                errMsg = res.errMsg;                
                // console.log(txHash);
                
            } else {
                // console.log('2');
                const tx = Btc.Transaction.fromHex(txHex);
                txHash = '0x' + tx.getId();
            }            
        }

        if (mycoin.name === 'FAB' && !mycoin.tokenType) {
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains.FAB.bytesPerInput;
                }

                const res1 = await this.getFabTransactionHex(seed, mycoin, toAddress, amount, 0,
                    satoshisPerBytes, bytesPerInput, getTransFeeOnly);
                txHex = res1.txHex;
                errMsg = res1.errMsg;
                transFee = res1.transFee;
                amountInTx = res1.amountInTx;
                txids = res1.txids;
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx };
                }

                if (!errMsg && txHex) {
                    if (doSubmit) {
                        const res = await this.apiService.postFabTx(txHex);
                        txHash = res.txHash;
                        errMsg = res.errMsg;
                    } else {
                        const tx = Btc.Transaction.fromHex(txHex);
                        txHash = '0x' + tx.getId();
                    }
                }

        } else if (mycoin.name == 'TRX') {
            console.log('start to send TRX');

            if (getTransFeeOnly) {
                return { txHex: '', txHash: '', errMsg: '', transFee: environment.chains.TRX.feeLimit / 1e6, amountInTx: 0, txids: '' };
            }            
            const address1 = mycoin.receiveAdds[0];
            const currentIndex = address1.index;            
            const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
            const priKeyDisp = keyPair.privateKey.toString('hex');

            amountInTx = new BigNumber(this.utilServ.toBigNumber(amount, 6));
            const amountNum2 = amountInTx.toNumber();

            const tradeobj = await tronWeb.transactionBuilder.sendTrx(toAddress, amountNum2, keyPair.address);

            const txHexObj = await tronWeb.trx.sign(tradeobj, priKeyDisp);

            if (txHexObj) {
                if (doSubmit) {
                    const receipt = await tronWeb.trx.sendRawTransaction(txHexObj);
                    txHex = txHexObj.raw_data_hex;
                    txHash = receipt.transaction.txID;
                    errMsg = '';
                } else {
                    txHex = txHexObj.raw_data_hex;
                    txHash = txHexObj.txID;

                    const raw_dat_hex = txHexObj.raw_data_hex;
                    txHash = txHexObj.txID;
                    txHex = '0a' + (raw_dat_hex.length / 2).toString(16) + '01' + raw_dat_hex + '1241' + txHexObj.signature;
                      
                }
            }
        } else 
        if (mycoin.tokenType == 'TRX') {

            if (getTransFeeOnly) {
                return { txHex: '', txHash: '', errMsg: '', transFee: environment.chains.TRX.feeLimitToken / 1e6, amountInTx: 0, txids: '' };
            }              
            const trc20ContractAddress = environment.addresses.smartContract[mycoin.name]['TRX']; // contract address
            const address1 = mycoin.receiveAdds[0];
            const currentIndex = address1.index;            
            const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
            const priKeyDisp = keyPair.privateKey.toString('hex');
            const tronWeb = new TronWeb(
                fullNode,
                solidityNode,
                eventServer,
                priKeyDisp
            );

            amountInTx = new BigNumber(this.utilServ.toBigNumber(amount, mycoin.decimals));
            const amountNum = amountInTx.toNumber();            
            
            try {
                const contract = await tronWeb.contract().at(trc20ContractAddress);
                console.log('gogogo');
                // Use call to execute a pure or view smart contract method.
                // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
                if (doSubmit) {

                    txHash = await contract.transfer(
                        toAddress, // address _to
                        amountNum   // amount
                    ).send({
                        feeLimit: environment.chains.TRX.feeLimitToken
                    });
                } else {

                    /*
                    const functionSelector = 'transfer(address,uint256)';

                    const options= {
                        feeLimit: 1000000,
                        callValue: 0,
                        userFeePercentage: 100,
                        shouldPollResponse: false,
                        from: '41de44a0022fa24706a1d23756d418980ff321db84'
                    };

                    const parameters = [
                        {
                          type: 'address',
                          value: '0xb2c57719f8ff16f9f20952947fb09601e465ce2d'
                        },
                        { type: 'uint256', value: amountNum }
                    ];

                     const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                        trc20ContractAddress,
                        functionSelector,
                        options,
                        parameters,
                        ''
                    );
                    const txHexObj = await tronWeb.trx.sign(transaction.transaction, priKeyDisp);
                    txHex = txHexObj.raw_data_hex;
                    txHash = txHexObj.txID;
                    */

                   const functionSelector = 'transfer(address,uint256)';

                   const options = {
                       feeLimit: environment.chains.TRX.feeLimitToken,
                       callValue: 0,
                       userFeePercentage: 100,
                       shouldPollResponse: false,
                       from: tronWeb.address.toHex(keyPair.address)
                   };
            
                   const parameters = [
                       {
                         type: 'address',
                         value: tronWeb.address.toHex(toAddress).replace(ADDRESS_PREFIX_REGEX, '0x')
                       },
                       { type: 'uint256', value: amountNum }
                   ];

                    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                        tronWeb.address.toHex(trc20ContractAddress),
                       functionSelector,
                       options,
                       parameters,
                       tronWeb.address.toHex(keyPair.address)
                   );
            
                   const txHexObj = await tronWeb.trx.sign(transaction.transaction, priKeyDisp);
                   const raw_dat_hex = txHexObj.raw_data_hex;
                   txHash = txHexObj.txID;
                   txHex = '0a' + (raw_dat_hex.length / 2).toString(16) + '01' + raw_dat_hex + '1241' + txHexObj.signature;
                    console.log('txHex=', txHex);
                }
                
                
            } catch (error) {
                console.error('trigger smart contract error', error);
            }            
        } 
        else if (mycoin.name === 'ETH') {
                if (!gasPrice) {
                    try {
                        gasPrice = await this.getEthGasprice();
                    } catch(e) {}
                    if(!gasPrice) {
                        gasPrice = environment.chains.ETH.gasPrice;;
                    }

                }
                if (!gasLimit) {
                    gasLimit = environment.chains.ETH.gasLimit;
                }
                transFee = Number(new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toNumber());
                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }
                amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, 18)));
                const address1 = mycoin.receiveAdds[0];
                const currentIndex = address1.index;

                const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
                const nonce = await this.apiService.getEthNonce(address1.address);
                const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                amountInTx = amountNum;

                const txParams = {
                    nonce: nonce,
                    gasPrice: gasPriceFinal,
                    gasLimit: gasLimit,
                    to: toAddress,
                    value: '0x' + amountNum.toString(16)
                };

                txHex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);

                if (doSubmit) {
                    const retEth = await this.apiService.postEthTx(txHex);
                    txHash = retEth.txHash;
                    errMsg = retEth.errMsg;
                    if (txHash && txHash.indexOf('txerError') >= 0) {
                        errMsg = txHash;
                        txHash = '';
                    }
                } else {
                    txHash = this.web3Serv.getTransactionHash(txHex);
                }
        } 
        else if (mycoin.tokenType === 'ETH') { // etheruem tokens

                const address1 = mycoin.receiveAdds[0];
                if (!gasPrice) {
                    try {
                        gasPrice = await this.getEthGasprice();
                    } catch(e) {}
                    if(!gasPrice) {
                        gasPrice = environment.chains.ETH.gasPrice;;
                    }

                }
                if (!gasLimit) {
                    gasLimit = environment.chains.ETH.gasLimitToken;
                }
                transFee = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toNumber();
                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }
                const currentIndex = address1.index;
                // console.log('currentIndex=' + currentIndex);
                const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
                const nonce = await this.apiService.getEthNonce(address1.address);

                let decimals = mycoin.decimals;

                if (!decimals) {
                    decimals = 18;
                }
                //console.log('decimals112===', decimals);
                // const amountSent = amount * Math.pow(10, decimals);
                const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                const toAccount = toAddress;

                //console.log('mycoin.name==', mycoin.name);
                let contractAddress = environment.addresses.smartContract[mycoin.name];
                if (contractAddress) {
                    //console.log('contractAddress==', contractAddress);
                
                    const addressType = typeof contractAddress;
                    if (addressType !== 'string') {
                     contractAddress = contractAddress['ETH'];
                    }
                } else {
                    contractAddress = mycoin.contractAddr;
                }

               //console.log('contractAddresscontractAddresscontractAddress=', contractAddress);
                // console.log('nonce = ' + nonce);
                const func = {
                    'constant': false,
                    'inputs': [
                        {
                            'name': 'recipient',
                            'type': 'address'
                        },
                        {
                            'name': 'amount',
                            'type': 'uint256'
                        }
                    ],
                    'name': 'transfer',
                    'outputs': [
                        {
                            'name': '',
                            'type': 'bool'
                        }
                    ],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                };

                const abiHex = this.web3Serv.getFuncABI(func);
                // a9059cbb
                // console.log('abiHexxx=' + abiHex);
                const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                amountInTx = amountSent;
                const txData = {
                    nonce: nonce,
                    gasPrice: gasPriceFinal,
                    gasLimit: gasLimit,
                    // to: contractAddress,
                    from: keyPair.address,
                    value: Number(0),
                    to: contractAddress,
                    data: '0x' + abiHex + this.utilServ.fixedLengh(toAccount.slice(2), 64) +
                        this.utilServ.fixedLengh(amountSent.toString(16), 64)
                };
                //console.log('txData==', txData);
                txHex = await this.web3Serv.signTxWithPrivateKey(txData, keyPair);
                // console.log('after sign');
                if (doSubmit) {
                    // console.log('111');
                    const retEth = await this.apiService.postEthTx(txHex);
                    txHash = retEth.txHash;
                    errMsg = retEth.errMsg;

                    if (txHash && txHash.indexOf('txerError') >= 0) {
                        errMsg = txHash;
                        txHash = '';
                    }
                } else {
                    // console.log('333');
                    txHash = this.web3Serv.getTransactionHash(txHex);
                    // console.log('444');
                }
        
            } else if(mycoin.name == 'BNB' || mycoin.name == 'MATIC' || mycoin.name == 'HT') {
                if (!gasPrice) {
                    try {
                        gasPrice = await this.getEtheruemCompatibleGasprice(mycoin.name);
                    } catch(e) {}
                    if(!gasPrice) {
                        gasPrice = environment.chains[mycoin.name].gasPrice;
                    }
                }
                if (!gasLimit) {
                    gasLimit = environment.chains[mycoin.name].gasLimit;
                }

                transFee = Number(new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toNumber());
                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }
                amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, 18)));
                const address1 = mycoin.receiveAdds[0];
                const currentIndex = address1.index;

                const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
                const nonce = await this.apiService.getEtheruemCampatibleNonce(mycoin.name, address1.address);
                const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                amountInTx = amountNum;

                const txParams = {
                    nonce: nonce,
                    gasPrice: gasPriceFinal,
                    gasLimit: gasLimit,
                    to: toAddress,
                    value: '0x' + amountNum.toString(16)
                };

                txHex = await this.web3Serv.signEtheruemCompatibleTxWithPrivateKey(mycoin.name,txParams, keyPair);

                console.log('txHex for BNB tokens:', txHex);
                if (doSubmit) {
                    const retBnb = await this.apiService.postEtheruemCompatibleTx(mycoin.name,txHex);
                    console.log('retBnb===', retBnb);
                    txHash = retBnb.txHash;
                    errMsg = retBnb.errMsg;
                    if (txHash && txHash.indexOf('txerError') >= 0) {
                        errMsg = txHash;
                        txHash = '';
                    }
                } else {
                    txHash = this.web3Serv.getTransactionHash(txHex);
                }
            }
            else if (mycoin.tokenType === 'BNB' || mycoin.tokenType == 'MATIC' || mycoin.tokenType == 'HT') { // etheruem tokens
                console.log('must go here');
                const address1 = mycoin.receiveAdds[0];
                if (!gasPrice) {
                    try {
                        gasPrice = await this.getEtheruemCompatibleGasprice(mycoin.tokenType);
                    } catch(e) {}
                    if(!gasPrice) {
                        gasPrice = environment.chains[mycoin.tokenType].gasPrice;
                    }
                }
                if (!gasLimit) {
                    gasLimit = environment.chains[mycoin.tokenType].gasLimitToken;
                }
                //gasPrice += 20;
                console.log('gasPrice==', gasPrice);
                transFee = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).shiftedBy(-9).toNumber();
                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }
                const currentIndex = address1.index;
                // console.log('currentIndex=' + currentIndex);
                const keyPair = this.getKeyPairs(mycoin, seed, 0, currentIndex);
                const nonce = await this.apiService.getEtheruemCampatibleNonce(mycoin.tokenType, address1.address);

                let decimals = mycoin.decimals;

                if (!decimals) {
                    decimals = 18;
                }
                console.log('decimals112===', decimals);
                // const amountSent = amount * Math.pow(10, decimals);
                const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                const toAccount = toAddress;

                let contractAddress = environment.addresses.smartContract[mycoin.name] ? environment.addresses.smartContract[mycoin.name][mycoin.tokenType] : '';
                if (!contractAddress) {
                    contractAddress = mycoin.contractAddr;
                }

               console.log('contractAddresscontractAddresscontractAddress=', contractAddress);
                // console.log('nonce = ' + nonce);
                const func = {
                    'constant': false,
                    'inputs': [
                        {
                            'name': 'recipient',
                            'type': 'address'
                        },
                        {
                            'name': 'amount',
                            'type': 'uint256'
                        }
                    ],
                    'name': 'transfer',
                    'outputs': [
                        {
                            'name': '',
                            'type': 'bool'
                        }
                    ],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                };

                const abiHex = this.web3Serv.getFuncABI(func);
                // a9059cbb
                // console.log('abiHexxx=' + abiHex);
                const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                amountInTx = amountSent;
                console.log('nonce===', nonce);
                console.log('gasPriceFinal===', gasPriceFinal);
                const txData = {
                    nonce: nonce,
                    gasPrice: gasPriceFinal,
                    gasLimit: gasLimit,
                    // to: contractAddress,
                    from: keyPair.address,
                    value: Number(0),
                    to: contractAddress,
                    data: '0x' + abiHex + this.utilServ.fixedLengh(toAccount.slice(2), 64) +
                        this.utilServ.fixedLengh(amountSent.toString(16), 64)
                };
                txHex = await this.web3Serv.signEtheruemCompatibleTxWithPrivateKey(mycoin.tokenType, txData, keyPair);
                // console.log('after sign');
                if (doSubmit) {
                    // console.log('111');
                    const retEth = await this.apiService.postEtheruemCompatibleTx(mycoin.tokenType,txHex);
                    txHash = retEth.txHash;
                    errMsg = retEth.errMsg;

                    if (txHash && txHash.indexOf('txerError') >= 0) {
                        errMsg = txHash;
                        txHash = '';
                    }
                } else {
                    // console.log('333');
                    txHash = this.web3Serv.getTransactionHash(txHex);
                    // console.log('444');
                }
        
            } 
            else if (mycoin.tokenType === 'FAB') { // fab tokens
                console.log('satoshisPerBytesgggg=', satoshisPerBytes);
                if (!gasPrice) {
                    gasPrice = environment.chains.FAB.gasPrice;
                }
                if (!gasLimit) {
                    gasLimit = environment.chains.FAB.gasLimit;
                }
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains.FAB.bytesPerInput;
                }
                console.log('gasPrice final=', gasPrice);
                let decimals = mycoin.decimals;
                if (!decimals) {
                    decimals = 18;
                }
                if (mycoin.name === 'DUSD') {
                    decimals = 6;
                }
                // const amountSent = BigInt(amount * Math.pow(10, decimals));
                // const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                const amountSent = this.utilServ.toBigNumber(amount, decimals);
                // const abiHex = this.web3Serv.getFabTransferABI([toAddress, amountSent.toString()]);

                const funcTransfer: any = {
                    'constant': false,
                    'inputs': [
                        {
                            'name': 'to',
                            'type': 'address'
                        },
                        {
                            'name': 'value',
                            'type': 'uint256'
                        }
                    ],
                    'name': 'transfer',
                    'outputs': [
                        {
                            'name': '',
                            'type': 'bool'
                        }
                    ],
                    'payable': false,
                    'stateMutability': 'nonpayable',
                    'type': 'function'
                };
                // console.log('foreeeee');

                amountInTx = new BigNumber(amountSent);
                let fxnCallHex = this.web3Serv.getGeneralFunctionABI(funcTransfer, [toAddress, amountSent]);
                // console.log('enddddd');
                fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);
                let contractAddress = mycoin.contractAddr;

                /*
                if (mycoin.name === 'EXG') {
                    contractAddress = environment.addresses.smartContract.EXG.FAB;
                } else if (mycoin.name === 'DUSD') {
                    contractAddress = environment.addresses.smartContract.DUSD;
                }
                */
               contractAddress = environment.addresses.smartContract[mycoin.name];
               const addressType = typeof contractAddress;
               if (contractAddress && (addressType !== 'string')) {
                contractAddress = contractAddress['FAB'];
               }
               if(!contractAddress) {
                   contractAddress = mycoin.contractAddr;
               }

                // const keyPair = this.getKeyPairs(mycoin, seed, 0, 0);

                // contractAddress = '0x28a6efffaf9f721a1e95667e3de54c622edc5ffa';
                contractAddress = this.utilServ.stripHexPrefix(contractAddress);
                // console.log('contractAddress=' + contractAddress);

                const totalAmount = gasLimit * gasPrice / 1e8;
                console.log('totalAmount==', totalAmount);
                // let cFee = 3000 / 1e8 // fee for the transaction

                // console.log('fxnCallHex=' + fxnCallHex);
                let totalFee = totalAmount;
                const contract = Btc.script.compile([
                    84,
                    this.utilServ.number2Buffer(gasLimit),
                    this.utilServ.number2Buffer(gasPrice),
                    this.utilServ.hex2Buffer(fxnCallHex),
                    this.utilServ.hex2Buffer(contractAddress),
                    194
                ]);

                // console.log('contract=====', contract);
                const contractSize = contract.toJSON.toString().length;

                // console.log('contractSize=' + contractSize);
                totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

                // console.log('totalFee=' + totalFee);
                console.log('satoshisPerBytessatoshisPerBytessatoshisPerBytes=', satoshisPerBytes);
                const baseCoin = mycoin.baseCoin;
                baseCoin.tokenType = 'FAB';
                console.log('totalFee==', totalFee);
                const res1 = await this.getFabTransactionHex(seed, baseCoin, contract, 0, totalFee,
                    satoshisPerBytes, bytesPerInput, getTransFeeOnly);

                baseCoin.tokenType = '';
                // console.log('res1=', res1);
                txHex = res1.txHex;
                errMsg = res1.errMsg;
                transFee = res1.transFee;
                txids = res1.txids;
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                if (getTransFeeOnly) {
                    return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
                }

                if (txHex) {
                    if (doSubmit) {
                        const res = await this.apiService.postFabTx(txHex);
                        txHash = res.txHash;
                        errMsg = res.errMsg;
                    } else {
                        const tx = Btc.Transaction.fromHex(txHex);
                        txHash = '0x' + tx.getId();
                    }
                }
            }
        const ret = { txHex: txHex, txHash: txHash, errMsg: errMsg, transFee: transFee, amountInTx: amountInTx, txids: txids };
        return ret;
    }

    fillUpAddress(mycoin: MyCoin, seed: Buffer, numReceiveAdds: number, numberChangeAdds: number) {
        for (let i = 0; i < numReceiveAdds; i++) {
            const keyPair = this.getKeyPairs(mycoin, seed, 0, i);
            const addr = new Address(mycoin.coinType, keyPair.address, i);
            if (mycoin.receiveAdds.length === 0) {
                mycoin.receiveAdds.push(addr);
            }
            
        }
        for (let i = 0; i < numberChangeAdds; i++) {
            const keyPair = this.getKeyPairs(mycoin, seed, 1, i);
            const addr = new Address(mycoin.coinType, keyPair.address, i);
            if (mycoin.changeAdds.length === 0) {
                mycoin.changeAdds.push(addr);
            }
        }

    }

    fillUpAddressByPrivateKey(coin: MyCoin, privateKey: string) {
        const keyPair = this.getKeyPairsFromPrivateKey(coin, privateKey);
        const addr = new Address(coin.coinType, keyPair.address, 0);
        coin.receiveAdds.push(addr);
    }

    async updateCoinBalance(coin: MyCoin) {
        const balance = await this.getBalance(coin);
        coin.balance = balance.balance;
        coin.lockedBalance = balance.lockbalance;
    }
}
