import { Component, OnInit, ViewChild } from '@angular/core';
import { PinNumberModal } from '../../shared/modals/pin-number/pin-number.modal';
import { StorageService } from '../../../services/storage.service';
import { UtilService } from '../../../services/util.service';
import { CoinService } from '../../../services/coin.service';
import { KanbanService } from '../../../services/kanban.service';
import { ApiService } from '../../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: [CoinService]
})
export class UpdateComponent implements OnInit {
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal = {} as PinNumberModal;
  name = '';
  tokenId = '';
  wallet: any;
  file = '';

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
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin) as Buffer;
    const privateKey = this.coinServ.getFabPrivateKey(seed);
    const data: { name: string; tokenId: string; logo: string; sig?: string } = {
      name: this.name,
      tokenId: this.tokenId,
      logo: this.file
    };

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;

    this.apiServ.updateIssueToken(data).subscribe(
      (ret: any) => {
        console.log('ret===', ret);
        if (ret && ret.ok) {
          this.alertServ.openSnackBar(this.translateServ.instant('Update successfully.'), this.translateServ.instant('Ok'));
        } else {
          if (ret._body) {
            this.alertServ.openSnackBar(ret._body, this.translateServ.instant('Ok'));
          } else {
            this.alertServ.openSnackBar('Update failed.', this.translateServ.instant('Ok'));
          }
        }
      }
    );
  }
}
