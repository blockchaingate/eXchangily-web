import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../../../services/api.service';
import { CoinService } from '../../../../../services/coin.service';
import { UtilService } from '../../../../../services/util.service';
import { KanbanService } from '../../../../../services/kanban.service';
import { TransactionReceiptResp, Transaction } from '../../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../../models/wallet';
import { MyCoin } from '../../../../../models/mycoin';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Web3Service } from '../../../../../services/web3.service';
import { AlertService } from '../../../../../services/alert.service';
import { TimerService } from '../../../../../services/timer.service';
import { WalletService } from '../../../../../services/wallet.service';
import { StorageService } from '../../../../../services/storage.service';

import * as bs58 from 'bs58';
import { environment } from '../../../../../../environments/environment';
import BigNumber from 'bignumber.js';
import { PinNumberModal } from '../../../../shared/modals/pin-number/pin-number.modal';
import * as createHash from 'create-hash';
import * as exaddr from '../../../../../lib/exaddr';

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.scss']
})

export class MyordersComponent implements OnInit, OnDestroy {
    // @Input() wallet: Wallet;
    mylockers: any;
    private wallet: any;
    exAddress: string;
    withdrawFee: number = 0;
    isProduction: boolean;
    transactionHistory: boolean;
    transactionHistories: any;
    screenheight = screen.height;
    select = 100;
    showAll = false;
    currentPair: any = '';
    baseCoin: number;
    targetCoin: number;
    openorders: Transaction[] = [];
    closedorders: Transaction[] = [];
    canceledorders: Transaction[] = [];
    allOpenorders: Transaction[] = [];
    allClosedorders: Transaction[] = [];
    allCanceledorders: Transaction[] = [];

    pin: string;
    orderHash: string;
    pair: string;
    modalWithdrawRef: BsModalRef;
    orderStatus: string;
    kanbanBalance: number;
    mytokens: any;
    opType: string;
    token: any;
    tokenMaps: any;
    srcId: string;
    destId: string;
    _chain: string;
    tsWalletBalance: number;
    set  chain(val: string) {
        this._chain = val;
        if(val) {
            

            for(let i = 0; i < this.tokenMaps.length; i++) {
                const tokenMap = this.tokenMaps[i];
                const chain = this.web3Serv.getChainName(tokenMap.srcChain);
                if(chain == val) {
                    this.srcId = tokenMap.srcId;
                    break;
                }
            }


            this.apiServ.getTsWalletBalance(val, this.srcId).then(
                balance => {
                    this.tsWalletBalance = balance;
                }
            )
        }
        
    }
    get chain() {
        return this._chain;
    }

    trxUSDTTSBalance: number;
    ethUSDTTSBalance: number;
    maticUSDTTSBalance: number;
    fabTSBalance: number;
    ethFABTSBalance: number;
    exgTSBalance: number;
    ethEXGTSBalance: number;
    bnbEXGTSBalance: number;

    bnbUSDTTSBalance: number;
    bnbFABTSBalance: number;
    bnbGETTSBalance: number;
    getTSBalance: number;
    
    bnbFETTSBalance: number;
    fetTSBalance: number;
    bstTSBalance: number;
    ethBSTTSBalance: number;

    dscTSBalance: number;
    ethDSCTSBalance: number;


    maticTSBalance: number;
    ethMATICTSBalance: number;

    minimumWithdrawAmount: number;
    coinType: number;
    coinName: string;
    gasPrice: number;

    coin: any;
    address: string;
    amount: number;

    gasLimit: number;
    withdrawAmount: number;
    @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
    withdrawModal: TemplateRef<any>;
    interval;
    transFeeAdvance = 0.0;
    coinServ: CoinService;
    lan: any = 'en';

    constructor(private _router: Router, private apiServ: ApiService, private _route: ActivatedRoute,
        public utilServ: UtilService, private kanbanServ: KanbanService, private _coinServ: CoinService,
        private modalService: BsModalService, private web3Serv: Web3Service, private alertServ: AlertService,
        private timerServ: TimerService, private walletServ: WalletService, private storageServ: StorageService) {
        this.coinServ = _coinServ;
    }

    ngOnDestroy() {
        this.timerServ.unCheckAllOrderStatus();
    }

    getOrders() {
        let orders: any = [];
        if (this.select === 0) {
            orders = this.showAll? this.allOpenorders : this.openorders;
        } else if (this.select === 1) {
            orders = this.showAll? this.allClosedorders : this.closedorders;
        } else if (this.select === 2) {
            orders = this.showAll? this.allCanceledorders : this.canceledorders;
        }
        return orders;
    }

    showWithdrawHistory() {
        const excoin: MyCoin = this.wallet.excoin;
        const url = '/market/withdraw_history/' + excoin.receiveAdds[0].address;
        this._router.navigate([url]);
    }

    async ngOnInit() {
        this.isProduction = environment.production;
        this.currentPair = this._route.snapshot.paramMap.get('pair');
        const pairCoins = this.currentPair.split('_');
        this.baseCoin = this._coinServ.getCoinTypeIdByName(pairCoins[1]);
        this.targetCoin = this._coinServ.getCoinTypeIdByName(pairCoins[0]);
        this.currentPair = this.currentPair.replace('_', '');

        // localStorage.removeItem("_myOrders");

        
        this.chain = '';

        this.transactionHistory = false;
        this.lan = localStorage.getItem('Lan');

        this.gasPrice = environment.chains.KANBAN.gasPrice;
        this.gasLimit = environment.chains.KANBAN.gasLimit;
        this.orderStatus = 'open';
        this.wallet = await this.walletServ.getCurrentWallet();
        if (this.wallet) {
            const address = this.wallet.excoin.receiveAdds[0].address;
            this.getLockers(address);
            const fabAddress = this.utilServ.exgToFabAddress(address);
            this.exAddress = exaddr.toKbpayAddress(fabAddress);
            this.timerServ.checkOrderStatus(address, 1);
            this.timerServ.checkTokens(address, 1);
        }

        this.prepareOrders();

        this.timerServ.tokens.subscribe(
            (data: any) => {
                const tokens = data.tokens;
                this.mytokens = tokens;
                console.log('this.mytokens=', this.mytokens);

                /*
                if(this.mytokens && (this.mytokens.length > 0)) {
                    for(let i=0;i<tokens.length;i++) {
                        const token = tokens[i];
                        for(let j=0;j<this.mytokens.length;j++) {
                            const mytoken = this.mytokens[j];
                            if(mytoken.coinType == token.coinType) {
                                mytoken.unlockedAmount = token.unlockedAmount;
                            }
                        }
                    }
                } else {
                    this.mytokens = tokens;
                }
                */
            }
        );

    }

    getLockers(address) {
        this.kanbanServ.getLocker(address).subscribe(
            (lockers: any) => {
                console.log('lockers====', lockers);
                this.mylockers = lockers;
            }
        );
    }
    
    prepareOrders() {
        this.timerServ.openOrders.subscribe(
            (orders: any) => {
                this.openorders = orders.filter(oo=>oo.pairName === this.currentPair);
                this.allOpenorders = orders;
                // localStorage.setItem("_myOrders", orders);
            }
        );
        this.timerServ.closedOrders.subscribe(
            (orders: any) => {
                this.closedorders = orders.filter(oo=>oo.pairName === this.currentPair);
                this.allClosedorders = orders;
            }
        );
        this.timerServ.canceledOrders.subscribe(
            (orders: any) => {
                this.canceledorders = orders.filter(oo=>oo.pairName === this.currentPair);
                this.allCanceledorders = orders;
            }
        );
    }




    async withdrawDo() {
        const amount = this.withdrawAmount;
        const pin = this.pin;

        /*
        let currentCoin;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            currentCoin = this.wallet.mycoins[i];
            if (
                ((this.coinName != 'USDT') && (this.coinName != 'FAB') && (['EXG', 'DSC', 'BST', 'MATIC', 'FET', 'GET'].indexOf(this.coinName) < 0) && (currentCoin.name === this.coinName))
                ||
                (this.coinName == 'USDT' && (currentCoin.name === this.coinName) && currentCoin.tokenType == this.chain)
                ||
                (this.coinName == 'MATIC' && (currentCoin.name === this.coinName) && !currentCoin.tokenType && this.chain == 'MATIC')
                ||
                (this.coinName == 'MATIC' && (currentCoin.name === this.coinName) && currentCoin.tokenType == 'ETH' && this.chain == 'ETH')
                ||
                (this.coinName == 'FAB' && (currentCoin.name === this.coinName) && !currentCoin.tokenType && (this.chain == 'FAB'))
                ||
                (this.coinName == 'FAB'  && (currentCoin.name === this.coinName) && currentCoin.tokenType == this.chain)
                ||
                ((['EXG', 'DSC', 'BST', 'FET', 'GET'].indexOf(this.coinName) >= 0)  && (currentCoin.name === this.coinName) && currentCoin.tokenType == this.chain)                
                ) {
                break;
            }
        }
        

        console.log('currentCoin=', currentCoin);
        */
        let addressInWallet = '';
        let currentCoin;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            currentCoin = this.wallet.mycoins[i];
            if(!currentCoin.tokenType && currentCoin.name == this.chain) {
                addressInWallet = currentCoin.receiveAdds[0].address;
                break;
            }
        }

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('密码错误。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            }
            return;
        }

        if (
            currentCoin.name === 'BTC' || ((currentCoin.name === 'FAB') && !currentCoin.tokenType) || 
            currentCoin.name === 'DOGE' || currentCoin.name === 'LTC' ||
            currentCoin.name == 'TRX' || currentCoin.tokenType == 'TRX') {
            const bytes = bs58.decode(addressInWallet);
            addressInWallet = Buffer.from(bytes).toString('hex');
            console.log('addressInWallet there we go:', addressInWallet);

        } else if (currentCoin.name === 'BCH') {
            const keyPairsCurrentCoin = this._coinServ.getKeyPairs(currentCoin, seed, 0, 0);
            let prefix = '6f';
            if (environment.production) {
                prefix = '00';
            }
            // address = prefix + this.stripHexPrefix(address);
            const addr = prefix + keyPairsCurrentCoin.addressHash;
            const buf = Buffer.from(addr, 'hex');

            const hash1 = createHash('sha256').update(buf).digest().toString('hex');
            const hash2 = createHash('sha256').update(Buffer.from(hash1, 'hex')).digest().toString('hex');

            addressInWallet = addr + hash2.substring(0, 8);
        } else if (currentCoin.name === 'FAB') {
            let fabAddress = '';
            for (let i = 0; i < this.wallet.mycoins.length; i++) {
                const coin = this.wallet.mycoins[i];
                if (coin.name === 'FAB') {
                    fabAddress = coin.receiveAdds[0].address;
                    break;
                }
            }
            if (fabAddress === '') {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('没有FAB地址。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('FAB address not found.', 'Ok');
                }
                return;
            }
            const bytes = bs58.decode(fabAddress);
            addressInWallet = Buffer.from(bytes).toString('hex');
        }




        const keyPairsKanban = this._coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);


        let nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);
        this.gasPrice = Number(this.gasPrice);
        this.gasLimit = Number(this.gasLimit);
        if (this.gasPrice <= 0 || this.gasLimit <= 0) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('燃料价格或限量错误。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Invalid gas price or gas limit.', 'Ok');
            }
            return;
        }
        const options = {
            gasPrice: this.gasPrice,
            gasLimit: this.gasLimit
        };

        this.apiServ.withdrawQuote(keyPairsKanban.address, addressInWallet, this.destId,  this.chain,  amount).subscribe(
            (ret: any) => {
                console.log('ret===', ret);
                if(ret.success) {
                    const data = ret.data;
                    const params = data.params;
                    
                    const rawtxs = [];
                    for(let i = 0; i < params.length; i++) {
                        const param = params[i];
                        const to = param.to;
                        const data = param.data;
                        const txKanbanHex = this.web3Serv.signAbiHexWithPrivateKey(data, keyPairsKanban, to, nonce++, 0, options);
                        rawtxs.push(txKanbanHex);
                    }

                    this.apiServ.claimWithdraw(rawtxs).subscribe(
                        (ret: any) => {
                            console.log('ret for claimWithdraw=', ret);
                            if(ret.result) {
                                if (this.lan === 'zh') {
                                    this.alertServ.openSnackBarSuccess('提币请求提交成功，等待处理。', 'Ok');
                                } else {
                                    this.alertServ.openSnackBarSuccess('Your withdraw request is pending.', 'Ok');
                                }
                            } else {
                                this.alertServ.openSnackBar(ret.message, 'Ok');
                            }
                        }
                    );

                } else {
                    this.alertServ.openSnackBar(ret.message, 'Ok');
                }
            }
        );



        /*
        const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.

        const abiHex = '';
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();


        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, options);

        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp: any) => {
            // console.log('resp=', resp);
            if (resp && resp.transactionHash) {


                this.modalWithdrawRef.hide();
                this.kanbanServ.incNonce();
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBarSuccess('提币请求提交成功，等待处理。', 'Ok');
                } else {
                    this.alertServ.openSnackBarSuccess('Your withdraw request is pending.', 'Ok');
                }
            } else {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('发生错误，请再试一次。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Errors happened, please try again.', 'Ok');
                }
            }
        });
        */
    }

    async openWithdrawModal(template: TemplateRef<any>) {
        this.modalWithdrawRef = this.modalService.show(template, { class: 'second' });

        let coinNameInKanban = this.coinName;
        if(this.coinName == 'USDT') {
            this.chain = 'TRX';
            coinNameInKanban = 'USDTX';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                if(!this.trxUSDTTSBalance) {
                    this.trxUSDTTSBalance = await this.coinServ.getTrxTokenBalance(environment.addresses.smartContract.USDT.TRX, environment.addresses.exchangilyOfficial.TRX);
                    this.trxUSDTTSBalance = new BigNumber(this.trxUSDTTSBalance).shiftedBy(-6).toNumber();
                }

                if(!this.ethUSDTTSBalance) {
                    const balance = await this.apiServ.getEthTokenBalance('USDT', environment.addresses.smartContract.USDT.ETH, environment.addresses.exchangilyOfficial.ETH);                    
                    this.ethUSDTTSBalance = new BigNumber(balance.balance).shiftedBy(-6).toNumber();
                }

                if(!this.bnbUSDTTSBalance) {
                    const balance = await this.coinServ.getEtherumCompatibleTokenBalance('BNB', environment.addresses.smartContract.USDT.BNB, environment.addresses.exchangilyOfficial.BNB);
                    this.bnbUSDTTSBalance = new BigNumber(balance, 16).shiftedBy(-18).toNumber();
                }   
                if(!this.maticUSDTTSBalance) {
                    const balance = await this.coinServ.getEtherumCompatibleTokenBalance('MATIC', environment.addresses.smartContract.USDT.MATIC, environment.addresses.exchangilyOfficial.MATIC);
                    this.maticUSDTTSBalance = new BigNumber(balance, 16).shiftedBy(-6).toNumber();
                }              
            }catch(e) {

            }           
        } else if(this.coinName == 'FAB') {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                if(!this.ethFABTSBalance) {
                    let balance = await this.apiServ.getEthTokenBalance('FAB', environment.addresses.smartContract.FAB.ETH, environment.addresses.exchangilyOfficial.ETH);                    
                    this.ethFABTSBalance = new BigNumber(balance.balance).shiftedBy(-8).toNumber();    
                }
         
                if(!this.fabTSBalance) {
                    const balance = await this.apiServ.getFabBalance(environment.addresses.exchangilyOfficial.FAB);
                    this.fabTSBalance = new BigNumber(balance.balance).shiftedBy(-8).toNumber();
                }

                if(!this.bnbFABTSBalance) {
                    const balance = await this.coinServ.getEtherumCompatibleTokenBalance('BNB', environment.addresses.smartContract.FAB.BNB, environment.addresses.exchangilyOfficial.BNB);
                    this.bnbFABTSBalance = new BigNumber(balance, 16).shiftedBy(-8).toNumber();
                }

            }catch(e) {

            }      
        } else if(this.coinName == 'FET') {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];
         

                const balance = await this.apiServ.getFabTokenBalance(this.coinName, this.utilServ.fabToExgAddress(environment.addresses.exchangilyOfficial.FAB));
                this.fetTSBalance = balance.balance / 1e18;


                if(!this.bnbFETTSBalance) {
                    const balance = await this.coinServ.getEtherumCompatibleTokenBalance('BNB', environment.addresses.smartContract.FET.BNB, environment.addresses.exchangilyOfficial.BNB);
                    this.bnbFETTSBalance = new BigNumber(balance, 16).shiftedBy(-18).toNumber();
                } 

            }catch(e) {

            }   
        } else if(this.coinName == 'GET') {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];
         

                const balance = await this.apiServ.getFabTokenBalance(this.coinName, this.utilServ.fabToExgAddress(environment.addresses.exchangilyOfficial.FAB));
                this.getTSBalance = balance.balance / 1e18;


                if(!this.bnbGETTSBalance) {
                    const balance = await this.coinServ.getEtherumCompatibleTokenBalance('BNB', environment.addresses.smartContract.GET.BNB, environment.addresses.exchangilyOfficial.BNB);
                    this.bnbGETTSBalance = new BigNumber(balance, 16).shiftedBy(-18).toNumber();
                } 

            }catch(e) {

            }   
        } else if(this.coinName == 'MATIC') {
            this.chain = 'MATIC';
            coinNameInKanban = 'MATICM';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                if(!this.ethMATICTSBalance) {
                    let balance = await this.apiServ.getEthTokenBalance('MATIC', environment.addresses.smartContract.MATIC, environment.addresses.exchangilyOfficial.ETH);                    
                    this.ethMATICTSBalance = new BigNumber(balance.balance).shiftedBy(-18).toNumber();    
                }
         
                if(!this.maticTSBalance) {
                    const balance = await this.apiServ.getEthereumCompatibleBalance('MATIC',environment.addresses.exchangilyOfficial.MATIC);
                    this.maticTSBalance = new BigNumber(balance, 16).shiftedBy(-18).toNumber();
                }

            }catch(e) {

            }             
        }else if(['EXG'].indexOf(this.coinName) >= 0) {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                let balance = await this.apiServ.getEthTokenBalance(this.coinName, environment.addresses.smartContract[this.coinName]['ETH'], environment.addresses.exchangilyOfficial.ETH);                    
                this.ethEXGTSBalance = balance.balance / 1e18;

                balance = await this.apiServ.getFabTokenBalance(this.coinName, this.utilServ.fabToExgAddress(environment.addresses.exchangilyOfficial.FAB));
                this.exgTSBalance = balance.balance / 1e18;


                if(!this.bnbEXGTSBalance) {
                    const balance = await this.coinServ.getEtherumCompatibleTokenBalance('BNB', environment.addresses.smartContract.EXG.BNB, environment.addresses.exchangilyOfficial.BNB);
                    this.bnbEXGTSBalance = new BigNumber(balance, 16).shiftedBy(-18).toNumber();
                }  

            }catch(e) {

            }  
        }else if(['DSC'].indexOf(this.coinName) >= 0) {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                let balance = await this.apiServ.getEthTokenBalance(this.coinName, environment.addresses.smartContract[this.coinName]['ETH'], environment.addresses.exchangilyOfficial.ETH);                    
                this.ethDSCTSBalance = balance.balance / 1e18;

                balance = await this.apiServ.getFabTokenBalance(this.coinName, this.utilServ.fabToExgAddress(environment.addresses.exchangilyOfficial.FAB));
                this.dscTSBalance = balance.balance / 1e18;

            }catch(e) {

            }  
        }else if(['BST'].indexOf(this.coinName) >= 0) {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                let balance = await this.apiServ.getEthTokenBalance(this.coinName, environment.addresses.smartContract[this.coinName]['ETH'], environment.addresses.exchangilyOfficial.ETH);                    
                this.ethBSTTSBalance = balance.balance / 1e18;

                balance = await this.apiServ.getFabTokenBalance(this.coinName, this.utilServ.fabToExgAddress(environment.addresses.exchangilyOfficial.FAB));
                this.bstTSBalance = balance.balance / 1e18;

            }catch(e) {

            } 
        } else
        {
            this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName];
        }
        
        const coinTypeId = this.coinServ.getCoinTypeIdByName(coinNameInKanban);
        this.kanbanServ.getTokenList().subscribe(
            (ret: any) => {
                const tokenList = ret.data.tokenList;
                for(let i = 0; i < tokenList.length; i++) {
                    const token = tokenList[i];
                    const type = token.type;
                    if(type == coinTypeId) {
                        this.withdrawFee = token.feeWithdraw;
                        break;
                    }
                }
            }
        );
        
    }

    selectOrder(ord: number) {
        this.currentPair = this._route.snapshot.paramMap.get('pair')?.replace('_', '');
        this.prepareOrders();

        this.select = ord;
        if (ord === 0) {
            this.orderStatus = 'open';
        } else if (ord === 1) {
            this.orderStatus = 'close';
        } else if (ord === 2) {
            this.orderStatus = 'canceled';
        }
    }

    deleteOrder(pair: string, orderHash: string) {
        console.log('orderHash=' + orderHash);
        if(!pair || !orderHash) {
            this.alertServ.openSnackBar('pair or orderHash not available', 'Ok');
            return;
        }
        this.orderHash = orderHash;
        this.pair = pair;
        this.opType = 'deleteOrder';

        this.pinModal.show();
    }

    unlock(token) {
        this.opType = 'unlock';
        this.token = token;
        this.pinModal.show();
    }

    getChainName(chainId) {
        return this.web3Serv.getChainName(chainId);
    }
    withdraw(withdrawModal: TemplateRef<any>, index: number) {
        console.log('withdraw there we go');


        this.coinName = this.mytokens.symbols[index];
        this.kanbanBalance = this.utilServ.toNumber(this.utilServ.showAmount(this.mytokens.balances[index], this.mytokens.decimals[index]));

        const tokenId = this.mytokens.ids[index];
        this.kanbanServ.getTokenMaps(tokenId).subscribe(
            (res: any) => {
                console.log('res of tokenMaps = ', res);
                if(res.success) {
                    this.tokenMaps = res.data;
                    const tokenMap = this.tokenMaps[0];
                    console.log('this.srcId===', this.srcId);
                    //this.srcId = tokenMap.srcId;
                    this.destId = tokenMap.destId;
                    this.chain = this.web3Serv.getChainName(tokenMap.srcChain);
                    
                    
                }
            }
        );
        this.opType = 'withdraw';
        // this.pin = sessionStorage.getItem('pin');
        // if (this.pin) {  
        this.openWithdrawModal(withdrawModal);

        // } else {
        //    this.withdrawModal = withdrawModal;
        // }         
    }

    onConfirmedWithdrawAmount() {
        const amount = this.withdrawAmount;


        if (amount > this.kanbanBalance) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('提币数量超过可用余额。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Withdraw amount is over your balance.', 'Ok');
            }
            return;
        }
        if(amount > this.tsWalletBalance) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
            }
            return;                
        }    


        this.modalWithdrawRef.hide();

        this.pinModal.show();
    }

    onConfirmedPin(pin: string) {
        this.pin = pin;
        const pinHash = this.utilServ.SHA256(pin).toString();
        if (pinHash !== this.wallet.pwdHash) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('密码错误。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            }
            return;
        }
        if (this.opType === 'withdraw') {
            this.withdrawDo();
        } else if (this.opType === 'deleteOrder') {
            this.deleteOrderDo();
        } else
        if(this.opType === 'unlock') {
            this.unlockDo();
        }

    }


    async unlockDo() {
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        if(!seed) {
            return;
        }
        const keyPairsKanban = this._coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const abiHex = this.web3Serv.getUnlockFuncABI(this.token.id, this.token.user);

        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        const address = await this.token.address;
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce);
        console.log('txhex=', txhex);
        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
            console.log('resp for unlock=', resp);
        });
    }

    async deleteOrderDo() {
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        if(!seed) {
            return;
        }
        const keyPairsKanban = this._coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const abiHex = this.web3Serv.getDeleteOrderFuncABI(this.orderHash);
        console.log('abiHex for deleteOrderDo=', abiHex);
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        const address = await this.kanbanServ.getExchangeAddress();
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, this.pair, nonce);
        console.log('txhex=', txhex);
        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
            console.log('resp=', resp);
            if (resp && resp.transactionHash) {

                console.log('go this way, address=', keyPairsKanban.address);
                this.timerServ.checkOrderStatus(keyPairsKanban.address, 10);

                // this.tradeService.saveTransactions(this.openorders);
                // this.kanbanServ.incNonce();
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('取消订单请求提交成功，等待区块链处理。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Cancel order request is pending.', 'Ok');
                }
            }
        });
    }

    showFilledPercentage(orderQty, orderFilledQty) {
        const orderQtyNum = new BigNumber(orderFilledQty);
        const orderQtyFilledNum = new BigNumber(orderQty);
        const ret = orderQtyNum.dividedBy(orderQtyFilledNum);
        return ret.toNumber() * 100;
    }

    eventCheck(event) {
        this.showAll = event.target.checked;
        this.currentPair = this._route.snapshot.paramMap.get('pair')?.replace('_', '');
        this.prepareOrders();
    }
}
