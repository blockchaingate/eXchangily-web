import { Component, ViewChild, TemplateRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
import { initOnRamp } from '../../../../cbpay-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'buy-coin-modal',
    templateUrl: './buy-coin.modal.html',
    styleUrls: ['./buy-coin.modal.css']
})
export class BuyCoinModal implements OnInit, OnDestroy{
    instance: any;
    currentAddress: string;
    blockchainName: string;
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

    
    getBlockChainName(coin: MyCoin) {
        const tokenType = coin.tokenType;
        let chainName = '';
        switch(tokenType) {
            case 'ETH':
                chainName = 'ethereum';
                break;                
        }
        return chainName;
    }
    
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

    ngOnDestroy(): void {
        this.instance.destroy();
    }

    onSubmit() {
        if (!this.coin) {
            this.coin = this.wallet.mycoins[this.currentCoinIndex];
        }

        let destinationWallets: any;

        /*
        if(this.blockchainName) {
            destinationWallets = [
                {
                  address: this.currentAddress,
                  blockchains: [this.blockchainName],
                  assets: [this.assetName]
                },
            ];
        } else {
          
        }
        */

        /*
        destinationWallets = [
            {
              address: this.currentAddress,
              assets: [this.assetName]
            },
        ]; 
        */
        destinationWallets = [
            {
              "address": this.currentAddress,
              "assets": [this.assetName]
            },
        ];         
        console.log('destinationWallets===', destinationWallets);
        this.instance = initOnRamp({
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
              top: '10px',
              width: '50%',
              height: '90%',
            },
        });
      
        this.instance.open();
        this.modalRef.hide();
        
    }

    onChange(index: number) {
        const coin = this.buyableCoins[index];
        this.blockchainName = this.getBlockChainName(coin);
        this.currentAddress = coin.receiveAdds[0].address;
        this.assetName = coin.name;
    }


}
