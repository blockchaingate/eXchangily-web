import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';

@Component({
  selector: 'otc-coin-address-modal',
  templateUrl: './otc-coin-address.component.html',
  styleUrls: ['./otc-coin-address.component.scss']
})
export class OtcCoinAddressModal implements OnInit {
    coinAddress: string;
    coins: any;
    coinName: string;
    wallet: Wallet;
    coin: any;
    currentCoin: any;
    @Output() confirmed = new EventEmitter<any>();
    @ViewChild('otcCoinAddressModal', { static: true }) public otcCoinAddressModal: ModalDirective;
    ngOnInit() {

    }

    show(coinName: string, wallet: Wallet) {
        console.log('showing coinaddress');
        this.coinName = coinName;
        this.wallet = wallet;
        if(this.wallet) {
          this.coins = this.wallet.mycoins
          .filter(item => item.name == coinName)
          .map(item => 
            {
              return {address: item.receiveAdds[0].address,tokenType: item.tokenType}
            });
        }

        this.otcCoinAddressModal.show();
    }    

    hide() {
      this.otcCoinAddressModal.hide();
    } 
    
    onSubmit() {
      // this.stripeCard.createToken(this.extraData);
      console.log('onSubmit for address');
      this.hide();
      const data = {
          address: this.coinAddress
      };
      this.confirmed.emit(data);  
    }    
}