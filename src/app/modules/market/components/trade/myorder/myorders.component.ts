import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from '../../../services/order.service';
import { TradeService } from '../../../services/trade.service';
import { CoinService } from '../../../../../services/coin.service';
import { UtilService } from '../../../../../services/util.service';
import { KanbanService } from '../../../../../services/kanban.service';
import {TransactionReceiptResp, Transaction} from '../../../../../interfaces/kanban.interface';
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

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css']
})

export class MyordersComponent implements OnInit, OnDestroy {
    // @Input() wallet: Wallet;
    private wallet: any;
    screenheight = screen.height;
    select = 0;
    myorders: Transaction[] = [];
    pin: string;
    orderHash: string;
    modalWithdrawRef: BsModalRef;
    orderStatus: string;
    mytokens: any;
    opType: string;
    token: any;
    minimumWithdrawAmount: number;
    coinType: number;
    coinName: string;
    gasPrice: number;
    gasLimit: number;
    withdrawAmount: number;
    @ViewChild('pinModal', {static: true}) pinModal: PinNumberModal;
    withdrawModal: TemplateRef<any>;
    interval;
    constructor(private ordServ: OrderService, private _router: Router, private tradeService: TradeService, 
        public utilServ: UtilService, private kanbanServ: KanbanService, private coinServ: CoinService, 
        private modalService: BsModalService, private web3Serv: Web3Service, private alertServ: AlertService,
        private timerServ: TimerService, private walletServ: WalletService, private storageServ: StorageService) {
    }

    /*
    onRefreshToken(tokens) {
        
        this.mytokens = tokens;
        console.log('mytokens in myorders', this.mytokens);
    }
    */
    ngOnDestroy() {
        this.timerServ.unCheckAllOrderStatus();
    }

    showWithdrawHistory() {
        const excoin: MyCoin = this.wallet.excoin;
        const url = '/market/withdraw_history/' + excoin.receiveAdds[0].address;
        this._router.navigate([url]);
    }

    async ngOnInit() {
        
        this.gasPrice = environment.chains.KANBAN.gasPrice;
        this.gasLimit = environment.chains.KANBAN.gasLimit;
        this.orderStatus = 'open';
        this.wallet = await this.walletServ.getCurrentWallet();
        if (this.wallet) {
            const address = this.wallet.excoin.receiveAdds[0].address;
            this.timerServ.checkOrderStatus(address, 1);
            this.timerServ.checkTokens(address, 1);
        }
        this.timerServ.ordersStatus.subscribe(
            (orders: any) => { 
                this.myorders = orders;
            }            
        );

        this.timerServ.tokens.subscribe(
            (tokens: any) => { 
                this.mytokens = tokens;
            }            
        );

    }

    async withdrawDo() {
        
        const amount = this.withdrawAmount;
        const pin = this.pin;        

        if (amount < environment.minimumWithdraw[this.coinServ.getCoinNameByTypeId(this.token.coinType)]) {
            this.alertServ.openSnackBar('Your withdraw minimum amount is not satisfied.', 'Ok');
            return;
        }

        if (amount > Number(this.utilServ.showAmount(this.token.unlockedAmount, 6))) {
            this.alertServ.openSnackBar('Your withdraw amount is bigger than your balance.', 'Ok');
            return;
        }
        let currentCoin ;
        for (let i = 0; i < this.wallet.mycoins.length; i++) {
            currentCoin = this.wallet.mycoins[i];
            if (currentCoin.name === this.coinName) {
                break;
            }
        }
        
        console.log('currentCoin=', currentCoin);
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        if (!seed) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');        
            return;   
        }         
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);   
        const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.
        let addressInWallet = currentCoin.receiveAdds[0].address;
        if (currentCoin.name === 'BTC' || currentCoin.name === 'FAB') {
            console.log('address1==', addressInWallet);
            const bytes = bs58.decode(addressInWallet);
            addressInWallet = bytes.toString('hex');
            console.log('address2==', addressInWallet);
        }
        if (currentCoin.tokenType === 'FAB') {
            let fabAddress = '';
            for (let i = 0; i < this.wallet.mycoins.length; i++) {
                const coin = this.wallet.mycoins[i];
                if (coin.name === 'FAB') {
                    fabAddress = coin.receiveAdds[0].address;
                }
            }
            if (fabAddress === '') {
                this.alertServ.openSnackBar('FAB address not found.', 'Ok');
                return;
            }
            const bytes = bs58.decode(fabAddress);
            addressInWallet = bytes.toString('hex');      
            console.log('addressInWallet for exg', addressInWallet);      
        }
        const abiHex = this.web3Serv.getWithdrawFuncABI(this.coinType, amountInLink, addressInWallet);  
        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        this.gasPrice = Number(this.gasPrice);
        this.gasLimit = Number(this.gasLimit);
        if (this.gasPrice <= 0 || this.gasLimit <= 0) {
            this.alertServ.openSnackBar('Invalid gas price or gas limit.', 'Ok');
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
                    status: 'pending'
                };
                this.storageServ.storeToTransactionHistoryList(item);
                this.timerServ.transactionStatus.next(item);
                this.timerServ.checkTransactionStatus(item);    
                this.modalWithdrawRef.hide();
                this.kanbanServ.incNonce();
                this.alertServ.openSnackBar('Your withdraw request is pending.', 'Ok');  
            } else {
                this.alertServ.openSnackBar('Some error happened. Please try again.', 'Ok');  
            }
        }); 
    }


    openWithdrawModal(template: TemplateRef<any>) {
        this.minimumWithdrawAmount = environment.minimumWithdraw[this.coinName];
        this.modalWithdrawRef = this.modalService.show(template, { class: 'second' });
    }

    selectOrder(ord: number) {

        this.select = ord;
        if (ord === 0) {
            this.orderStatus = 'open';
        } else
        if (ord === 1) {
            this.orderStatus = 'close';
        } else
        if (ord === 2) {
            this.orderStatus = 'canceled';
        }
    }

    deleteOrder(orderHash: string) {
        console.log('orderHash=' + orderHash);
        this.orderHash = orderHash;
        this.opType = 'deleteOrder';
        /*
        this.pin = sessionStorage.getItem('pin');
        if (this.pin) {
            this.deleteOrderDo();
        
        } else {
            // this.openPinModal(pinModal);
        }
        */
       this.pinModal.show();
    }

    withdraw(withdrawModal: TemplateRef<any>, token) {
        this.token = token;
        console.log('token=', this.token);

        this.coinType = Number(this.token.coinType);

        this.coinName = this.coinServ.getCoinNameByTypeId(this.coinType);        
        this.opType = 'withdraw';
        // this.pin = sessionStorage.getItem('pin');
        // if (this.pin) {  
            this.openWithdrawModal(withdrawModal);
        
        // } else {
        //    this.withdrawModal = withdrawModal;
        // }         
    }


    onConfirmedWithdrawAmount() {
        this.modalWithdrawRef.hide();
        this.pinModal.show();
    }

    onConfirmedPin(pin: string) {
        this.pin = pin;
        const pinHash = this.utilServ.SHA256(pin).toString();
        if (pinHash !== this.wallet.pwdHash) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            return;
        } 
        if (this.opType === 'withdraw') {
            this.withdrawDo();
        } else
        if (this.opType = 'deleteOrder') {
            this.deleteOrderDo();
        }
        
    }

    async deleteOrderDo() {

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);        
        const abiHex = this.web3Serv.getDeleteOrderFuncABI(this.orderHash);
        console.log('abiHex for deleteOrderDo=', abiHex);
        const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

        const address = await this.kanbanServ.getExchangeAddress();
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce); 
          console.log('txhex=', txhex);
        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
            console.log('resp=', resp);
            if (resp && resp.transactionHash) {     
                // this.tradeService.deleteTransaction(this.orderHash);   

                for (let i = 0; i < this.myorders.length; i++) {
                    if (this.myorders[i].orderHash === this.orderHash) {
                        this.myorders.splice(i, 1);
                        break;
                    }
                }   
                
                this.tradeService.saveTransactions(this.myorders);
                this.kanbanServ.incNonce();
                this.alertServ.openSnackBar('Your deleting order request is pending.', 'Ok');
            }
        });
    }
}
