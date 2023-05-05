import { Component, OnInit, ViewChild } from '@angular/core';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { KycService } from 'src/app/services/kyc.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

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
    private alertServ: AlertService,
    private storageService: StorageService) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet();
    let walletAddress = '';
    if(this.wallet) {
      const address = this.wallet.excoin.receiveAdds[0].address;
      walletAddress = this.utilServ.exgToFabAddress(address);
      this.kycServ.getByWalletAddress(walletAddress).subscribe(
        (ret: any) => {
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
    if(!this.wallet) {
      this.alertServ.openSnackBar('No wallet', 'Ok');
      return;
    }
    this.pinModal.show();
  }

  signin() {
    this.type = 'signin';
    if(!this.wallet) {
      this.alertServ.openSnackBar('No wallet', 'Ok');
      return;
    }
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
      this.kycServ.userAdd(data).subscribe({
        next: (ret: any) => {
          if(ret.success) {
            const data = ret.data;
            const token = data.token;
            this.storageService.setItem('otc_token', token).subscribe(
              () => {
                let next_url = 'email/' + this.email;

                this.storageService.setItem('next_url', next_url).subscribe(
                  () => {
                    this.router.navigate(['/wallet/kyc-process']);
                  }
                );
              }
            );
          }
        },
        error: (ret: any) => {
          if(ret.error) {
            if(ret.error.message) {
              this.alertServ.openSnackBar(ret.error.message, 'Ok');
            }
          }
        }
      });
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

                let next_url = '';
                if(!this.kyc) {
                  next_url = 'email/' + this.user.email;
                } else {
                  const step = this.kyc.step;
                  if(step == 0) {
                    next_url = 'phone';
                  } else 
                  if(step == 1) {
                    next_url = 'nationality';
                  } else
                  if(step == 2) {
                    next_url = 'identity';
                  } else
                  if(step == 3) {
                    next_url = 'customer-due-diligence';
                  } else
                  if(step <= 5) {
                    next_url = 'document';
                  }
                }

                this.storageService.setItem('next_url', next_url).subscribe(
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
