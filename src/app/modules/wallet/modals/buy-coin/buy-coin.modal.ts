import { Component, ViewChild, TemplateRef, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendCoinForm } from '../../../../interfaces/kanban.interface';
import { Wallet } from '../../../../models/wallet';
import { FormBuilder } from '@angular/forms';
import { MyCoin } from '../../../../models/mycoin';
import { environment } from '../../../../../environments/environment';
import { CoinService } from '../../../../services/coin.service';
import { AlertService } from '../../../../services/alert.service';
import { UtilService } from '../../../../services/util.service';
import { ApiService } from '../../../../services/api.service';
import BigNumber from 'bignumber.js';
import { TranslateService } from '@ngx-translate/core';
import { initOnRamp } from '../../../../cbpay-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'buy-coin-modal',
    templateUrl: './buy-coin.modal.html',
    styleUrls: ['./buy-coin.modal.css']
})
export class BuyCoinModal implements OnInit{
    currentAddress: string;
    //blockchainName: string;
    assetName: string;
    modalRef: BsModalRef;
    @Input() wallet: Wallet;
    @Input() alertMsg: string;
    coin: MyCoin;
    @ViewChild('buyCoinModal', { static: true }) public buyCoinModal: ModalDirective;
    currentCoinIndex: number;
    currentCoinBalance: number;
    //buyAmount: number;

    buyableCoins: any;
    constructor(
        private modalService: BsModalService) {

    }

    /*
    getBlockChainName(coin: MyCoin) {
        const coinName = coin.name;
        const tokenType = coin.tokenType;
        const chainShortName = tokenType ? tokenType : coinName;
        let chainName = '';
        switch(chainShortName) {
            case 'BTC': 
                chainName = 'bitcoin';
                break;
            case 'ETH':
                chainName = 'ethereum';
                break;                
        }
        return chainName;
    }
    */
    openModal(template: TemplateRef<any>) {
        if (this.wallet) {
            
            this.buyableCoins = this.wallet.mycoins.filter(
                item => item.name == 'BTC' || 
                item.name == 'ETH' || 
                item.name == 'LTC' || 
                item.name == 'DOGE' || 
                item.name == 'BCH' || 
                (item.name == 'USDC' && item.tokenType == 'ETH') || 
                (item.name == 'USDT' && item.tokenType == 'ETH'));
            if(this.buyableCoins && this.buyableCoins.length > 0) {
                this.onChange(0);
            }

        }
        this.modalRef = this.modalService.show(template);
    }

    ngOnInit() {
        this.currentCoinIndex = 0;
        this.currentAddress = '';
        if (this.wallet) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
            this.currentAddress = this.coin.receiveAdds[0].address;
        }   
    }
    onSubmit() {
        if (!this.coin) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
        }

        const destinationWallets: any = [
            {
              address: this.currentAddress,
              //blockchains: this.blockchainName == 'ethereum' ? [this.blockchainName] : null,
              assets: [this.assetName]
            },
          ];
          
          const instance = initOnRamp({
            target: '#button-container',
            appId: '6a6b1793-0892-4889-b6ae-a193fe650321',
            widgetParameters: {
              destinationWallets,
            },
            onExit: () => {
              alert('On Exit');
            },
            onSuccess: () => {
              alert('On Success');
            },
            onEvent: (metadata) => {
              console.log(metadata);
            },
            closeOnExit: true,
            closeOnSuccess: true,
            embeddedContentStyles: {
              top: '100px',
              width: '50%',
            },
        });
      
        instance.open();
    }

    onChange(index: number) {
        const coin = this.buyableCoins[index];
        //this.blockchainName = this.getBlockChainName(coin);
        this.currentAddress = coin.receiveAdds[0].address;
        this.assetName = coin.name;
    }


}
