import { Component, OnInit, ViewChild } from '@angular/core';
import { PinNumberModal } from '../../shared/modals/pin-number/pin-number.modal';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: [CoinService]
})
export class UpdateComponent implements OnInit {
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;
  name: string;
  tokenId: string;
  wallet: any;
  file: string;
  constructor(
    private coinServ: CoinService,
    private apiServ: ApiService,
    private storageService: StorageService,
    private kanbanServ: KanbanService,
    private translateServ: TranslateService,
    private alertServ: AlertService,
    private utilServ: UtilService
    ) { }

  async ngOnInit() {
    this.wallet = await this.storageService.getCurrentWallet();

  }
  confirm() {
    if (!this.tokenId) {
      return;
    }

    this.pinModal.show();
  }

  async onConfirmedPin(pin: string) {
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    const privateKey = this.coinServ.getFabPrivateKey(seed);

    const data = {
      name: this.name,
      tokenId: this.tokenId,
      logo: this.file
    };

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  
    this.apiServ.updateIssueToken(data).subscribe(
      (ret: any) => {
        console.log('ret===', ret);
        if(ret && ret.ok) {
          this.alertServ.openSnackBar(this.translateServ.instant('Update successfully.'), this.translateServ.instant('Ok'));
        } else {
          if(ret._body) {
            this.alertServ.openSnackBar(ret._body, this.translateServ.instant('Ok'));
          } else {
            this.alertServ.openSnackBar('Update failed.', this.translateServ.instant('Ok'));
          }
          
        }
      }
    );
  }
}
