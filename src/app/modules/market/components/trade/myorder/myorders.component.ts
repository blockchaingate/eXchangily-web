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
import BigNumber from 'bignumber.js/bignumber';
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
    private wallet: any;
    exAddress: string;
    isProduction: boolean;
    transactionHistory: boolean;
    transactionHistories: any;
    screenheight = screen.height;
    select = 100;
    showAll = false;
    currentPair = '';
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
    modalWithdrawRef: BsModalRef;
    orderStatus: string;
    mytokens: any;
    opType: string;
    token: any;
    _chain: string;
    set  chain(val: string) {
        this._chain = val;
        if(val && this.coinName == 'USDT') {
            this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];
        }
        
    }
    get chain() {
        return this._chain;
    }

    trxUSDTTSBalance: number;
    ethUSDTTSBalance: number;
    fabTSBalance: number;
    ethFABTSBalance: number;
    exgTSBalance: number;
    ethEXGTSBalance: number;

    bnbUSDTTSBalance: number;
    bnbFABTSBalance: number;

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
    lan = 'en';

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
        let orders = [];
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
            const fabAddress = this.utilServ.exgToFabAddress(address);
            this.exAddress = exaddr.toKbpayAddress(fabAddress);
            this.timerServ.checkOrderStatus(address, 1);
            this.timerServ.checkTokens(address, 1);
        }

        this.prepareOrders();

        this.timerServ.tokens.subscribe(
            (tokens: any) => {
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

        let currentCoin;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            currentCoin = this.wallet.mycoins[i];
            if (
                ((this.coinName != 'USDT') && (this.coinName != 'FAB') && (['EXG', 'DSC', 'BST'].indexOf(this.coinName) < 0) && (currentCoin.name === this.coinName))
                ||
                (this.coinName == 'USDT' && (currentCoin.name === this.coinName) && currentCoin.tokenType == this.chain)
                ||
                (this.coinName == 'FAB' && (currentCoin.name === this.coinName) && !currentCoin.tokenType && (this.chain == 'FAB'))
                ||
                (this.coinName == 'FAB'  && (currentCoin.name === this.coinName) && currentCoin.tokenType == this.chain)
                ||
                ((['EXG', 'DSC', 'BST'].indexOf(this.coinName) >= 0)  && (currentCoin.name === this.coinName) && currentCoin.tokenType == this.chain)                
                ) {
                break;
            }
        }

        console.log('currentCoin=', currentCoin);
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('密码错误。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            }
            return;
        }
        const keyPairsKanban = this._coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.
        let addressInWallet = currentCoin.receiveAdds[0].address;

        if (
            currentCoin.name === 'BTC' || ((currentCoin.name === 'FAB') && !currentCoin.tokenType) || 
            currentCoin.name === 'DOGE' || currentCoin.name === 'LTC' ||
            currentCoin.name == 'TRX' || currentCoin.tokenType == 'TRX') {
            const bytes = bs58.decode(addressInWallet);
            addressInWallet = bytes.toString('hex');
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
        } else if (currentCoin.tokenType === 'FAB') {
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
            addressInWallet = bytes.toString('hex');
        }

        /*
         else if () {
            const address = currentCoin.receiveAdds[0].address;
            addressInWallet = this.coinServ.trxToHex(address);
        }
        */

        console.log('currentCoin==', currentCoin);
        let coinTypePrefix = this.coinServ.getCoinTypePrefix(currentCoin);
        console.log('coinTypePrefix=',coinTypePrefix);
        const abiHex = this.web3Serv.getWithdrawFuncABI(this.coinType, amountInLink, addressInWallet, coinTypePrefix);

        console.log('abiHex for withdraw=', abiHex);
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

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

        const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, options);

        this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp: any) => {
            // console.log('resp=', resp);
            if (resp && resp.transactionHash) {
                /*
                const item = {
                    walletId: this.wallet.id,
                    type: 'Withdraw',
                    coin: currentCoin.name,
                    tokenType: currentCoin.tokenType,
                    amount: amount,
                    txid: resp.transactionHash,
                    time: new Date(),
                    confirmations: '0',
                    blockhash: '',
                    comment: '',
                    to: addressInWallet,
                    status: 'pending'
                };
                this.storageServ.storeToTransactionHistoryList(item);
                this.timerServ.transactionStatus.next(item);
                this.timerServ.checkTransactionStatus(item);
                */

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
    }

    async openWithdrawModal(template: TemplateRef<any>) {
        this.modalWithdrawRef = this.modalService.show(template, { class: 'second' });

        console.log('this.coinName==', this.coinName);
        if(this.coinName == 'USDT') {
            this.chain = 'TRX';
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
        }else if(['EXG', 'DSC', 'BST'].indexOf(this.coinName) >= 0) {
            this.chain = 'FAB';
            try {
                this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName][this.chain];

                let balance = await this.apiServ.getEthTokenBalance(this.coinName, environment.addresses.smartContract[this.coinName]['ETH'], environment.addresses.exchangilyOfficial.ETH);                    
                this.ethEXGTSBalance = balance.balance / 1e18;

                balance = await this.apiServ.getFabTokenBalance(this.coinName, this.utilServ.fabToExgAddress(environment.addresses.exchangilyOfficial.FAB));
                this.exgTSBalance = balance.balance / 1e18;

            }catch(e) {

            }  
        } else
        {
            this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName];
        }
        

        
    }

    selectOrder(ord: number) {
        this.currentPair = this._route.snapshot.paramMap.get('pair').replace('_', '');
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

    deleteOrder(orderHash: string) {
        console.log('orderHash=' + orderHash);
        this.orderHash = orderHash;
        this.opType = 'deleteOrder';

        this.pinModal.show();
    }

    withdraw(withdrawModal: TemplateRef<any>, token) {
        console.log('withdraw there we go');
        this.token = token;
        // console.log('token=', this.token);

        this.coinType = Number(this.token.coinType);

        this.coinName = this._coinServ.getCoinNameByTypeId(this.coinType);

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

        if (amount < environment.minimumWithdraw[this.coinName]) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('未满足最低提币量要求。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Your withdraw minimum amount is not satisfied.', 'Ok');
            }
            return;
        }

        if (amount > Number(this.utilServ.showAmount(this.token.unlockedAmount, 18))) {
            if (this.lan === 'zh') {
                this.alertServ.openSnackBar('提币数量超过可用余额。', 'Ok');
            } else {
                this.alertServ.openSnackBar('Withdraw amount is over your balance.', 'Ok');
            }
            return;
        }

        if(this.coinName == 'USDT') {
            if(this.chain == 'TRX' && (!this.trxUSDTTSBalance || (amount > this.trxUSDTTSBalance))) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
                }
                return;                
            }

            if(this.chain == 'ETH' && (!this.ethUSDTTSBalance || (amount > this.ethUSDTTSBalance))) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
                }
                return;                
            }            
        }

        if(this.coinName == 'FAB') {
            if(this.chain == 'FAB' && (!this.fabTSBalance || (amount > this.fabTSBalance))) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
                }
                return;                
            }

            if(this.chain == 'ETH' && (!this.ethFABTSBalance || (amount > this.ethFABTSBalance))) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
                }
                return;                
            }            
        }

        if(['EXG', 'DSC', 'BST'].indexOf(this.coinName) >= 0) {
            if(this.chain == 'FAB' && (!this.exgTSBalance || (amount > this.exgTSBalance))) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
                }
                return;                
            }

            if(this.chain == 'ETH' && (!this.ethEXGTSBalance || (amount > this.ethEXGTSBalance))) {
                if (this.lan === 'zh') {
                    this.alertServ.openSnackBar('TS钱包余额不足。', 'Ok');
                } else {
                    this.alertServ.openSnackBar('Withdraw amount is over ts balance.', 'Ok');
                }
                return;                
            }            
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
        }

    }




    async deleteOrderDo() {
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        const keyPairsKanban = this._coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
        const abiHex = this.web3Serv.getDeleteOrderFuncABI(this.orderHash);
        console.log('abiHex for deleteOrderDo=', abiHex);
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        const address = await this.kanbanServ.getExchangeAddress();
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce);
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
        const orderQtyNum = new BigNumber(this.utilServ.showAmount(orderFilledQty, 2));
        const orderQtyFilledNum = new BigNumber(this.utilServ.showAddAmount(orderQty, orderFilledQty, 2));
        const ret = orderQtyNum.dividedBy(orderQtyFilledNum);
        return ret.toNumber() * 100;
    }

    eventCheck(event) {
        this.showAll = event.target.checked;
        this.currentPair = this._route.snapshot.paramMap.get('pair').replace('_', '');
        this.prepareOrders();
    }
}
