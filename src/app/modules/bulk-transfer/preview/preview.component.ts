import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PinNumberModal } from '../../shared/modals/pin-number/pin-number.modal';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';
import { WalletService } from '../../../services/wallet.service';
import { CoinService } from '../../../services/coin.service';
import { KanbanService } from '../../../services/kanban.service';
import { Web3Service } from '../../../services/web3.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-bulk-transfer-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  providers: [WalletService,CoinService,KanbanService, Web3Service, AlertService, UtilService]
})
export class PreviewComponent implements OnInit {
    @Input() accounts: any;
    assets: any;
    pin: string;
    item: any;
    sendAllFlag: boolean;
    nonce: number;
    seed: any;
    wallet: any;
    @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

    constructor(
        private utilServ: UtilService,
        private alertServ: AlertService,
        private walletServ: WalletService,
        private coinServ: CoinService,
        private kanbanServ: KanbanService,
        private web3Serv: Web3Service
    ) {
    }
    async ngOnInit() {
        this.sendAllFlag = false;
        console.log('this.accounts in ngOnInit==', this.accounts);
        var keyNames = Object.keys(this.accounts);

        this.assets = [];
        this.wallet = await this.walletServ.getCurrentWallet();
        keyNames.forEach(
            (address) => {
                const value = this.accounts[address];
                this.assets.push(
                    {
                        address: address,
                        assets: value
                    }
                );
            }
        );
    }

    sendAssets(item) {
        this.sendAllFlag = false;
        console.log('item for sendAssets=', item);
        this.item = item;
        if(!this.seed) {
            this.pinModal.show();
        } else {
            this.sendAssetsDo();
        }
        
    }

    async sendAll() {
        
        this.sendAllFlag = true;
        if(!this.seed) {
            this.pinModal.show();
        } else {
            for(let i = 0; i < this.assets.length; i++) {
                const item = this.assets[i];
                await this.sendAssetsDoItem(item);
            };
        }


    }
    async sendAssetsDo() {
        this.sendAssetsDoItem(this.item);
    }

    async sendAssetsDoItem(item) {
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, this.seed, 0, 0);
        const gas = item.assets.gas;
        let address = item.address;

        console.log('this.nonce before =', this.nonce);
        if(!this.nonce) {
            this.nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);
        }
        console.log('this.nonce after =', this.nonce);

        var keyNames = Object.keys(item.assets);
        for(let i = 0; i<keyNames.length;i++) {
            const name = keyNames[i];
            const value = item.assets[name];
            if(name == 'gas') {
                this.sendGas(keyPairsKanban, address, gas, this.nonce);
            } else {
                this.sendAsset(keyPairsKanban, address, name, value, this.nonce);
            }  
            this.nonce ++;          
        }
        console.log('this.nonce before exit =', this.nonce);
    }

    async onConfirmedPin(pin: string) {
        this.pin = pin;
        const pinHash = this.utilServ.SHA256(pin).toString();
        if (pinHash !== this.wallet.pwdHash) {
            this.alertServ.openSnackBar('Your password is invalid.', 'Ok');
            return;
        }
        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
        this.seed = seed;
        if(!this.sendAllFlag) {
            this.sendAssetsDo();
        } else {
            for(let i = 0; i < this.assets.length; i++) {
                const item = this.assets[i];
                await this.sendAssetsDoItem(item);
            };            
        }
        
    } 
    
    sendGas(keyPairsKanban, address, gas, nonce) {
        const privateKey = Buffer.from(keyPairsKanban.privateKeyHex, 'hex');

        if(address.indexOf('0x') < 0) {
            address = this.utilServ.fabToExgAddress(address);
        }

        const txhex = this.web3Serv.sendGasHex(privateKey, address, new BigNumber(gas).multipliedBy(new BigNumber(1e18)), nonce);

        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
            console.log('resp=', resp);
            if (resp && resp.transactionHash) {

                this.alertServ.openSnackBar('转燃料请求提交成功，等待区块链处理。', 'Ok');
            }
        });        
    }

    async sendAsset(keyPairsKanban, address, name, amount, nonce) {
        const coin = this.coinServ.getCoinTypeIdByName(name);

        if(address.indexOf('0x') < 0) {
            address = this.utilServ.fabToExgAddress(address);
        }

        const abiHex = this.web3Serv.getTransferFuncABIAmountBig(coin, address, new BigNumber(amount).multipliedBy(new BigNumber(1e18)));

        const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce);

        this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
            console.log('resp=', resp);
            if (resp && resp.transactionHash) {

                this.alertServ.openSnackBar('转账请求提交成功，等待区块链处理。', 'Ok');
            }
        });



    }
}