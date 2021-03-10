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
        var keyNames = Object.keys(this.accounts);
        this.assets = [];
        this.wallet = await this.walletServ.getCurrentWallet();
        keyNames.forEach(
            (address) => {
                const value = this.accounts[address];
                console.log('valuuu=', value);
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
        this.item = item;
        if(!this.seed) {
            this.pinModal.show();
        } else {
            this.sendAssetsDo();
        }
        
    }

    async sendAssetsDo() {
        const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, this.seed, 0, 0);
        const gas = this.item.assets.gas;
        const address = this.item.address;
        if(!this.nonce) {
            this.nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);
        }
        

        var keyNames = Object.keys(this.item.assets);
        keyNames.forEach(
            (name) => {
                const value = this.item.assets[name];
                if(name == 'gas') {
                    this.sendGas(keyPairsKanban, address, gas, this.nonce ++);
                } else {
                    this.sendAsset(keyPairsKanban, address, name, value, this.nonce ++);
                }
            }
        );
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
        this.sendAssetsDo();
    } 
    
    sendGas(keyPairsKanban, address, gas, nonce) {
        const privateKey = Buffer.from(keyPairsKanban.privateKeyHex, 'hex');
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