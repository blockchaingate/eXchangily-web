import { Component, OnInit, ViewChild } from '@angular/core';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { KycService } from 'src/app/services/kyc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
  first_name: string;
  last_name: string;
  email: string;
  user: any;
  kyc: any;
  wallet: any;
  type: string; 

  constructor(
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private utilServ: UtilService,
    private kycServ: KycService,
    private router: Router,
    private storageService: StorageService) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet();
    console.log('this.wallet=', this.wallet);
    let walletAddress = '';
    if(this.wallet) {
      const address = this.wallet.excoin.receiveAdds[0].address;
      walletAddress = this.utilServ.exgToFabAddress(address);
      this.kycServ.getByWalletAddress(walletAddress).subscribe(
        (ret: any) => {
          console.log('ret===', ret);
          if(ret.success) {
            const data = ret.data;
            this.user = data.user;
            this.kyc = data.kyc;
          }
        }
      );
    }

  }

  signup() {
    this.type = 'signup';
    this.pinModal.show();
  }

  signin() {
    this.type = 'signin';
    this.pinModal.show();
  }

  onConfirmedPin(pin: string) {
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    const privateKey = this.coinServ.getFabPrivateKey(seed);

    if(this.type == 'signup') {
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email
      };
  
      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;  
      this.kycServ.userAdd(data).subscribe(
        (ret: any) => {
          if(ret.success) {
            const data = ret.data;
            const token = data.token;
            this.storageService.setItem('otc_token', token).subscribe(
              () => {
                this.storageService.setItem('otc_email', this.email).subscribe(
                  () => {
                    this.router.navigate(['/wallet/kyc-process']);
                  }
                );
              }
            );
          }
        }
      );
    } else {
      const data = {
        action: 'login'
      };
  
      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;  
      this.kycServ.login(data).subscribe(
        (ret: any) => {
          if(ret.success) {
            const data = ret.data;
            const token = data.token;
            this.storageService.setItem('otc_token', token).subscribe(
              () => {
                this.storageService.setItem('otc_email', this.email).subscribe(
                  () => {
                    this.router.navigate(['/wallet/kyc-process']);
                  }
                );
              }
            );
          }
        }
      );
    }

  }
}
