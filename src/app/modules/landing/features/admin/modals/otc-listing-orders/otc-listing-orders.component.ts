import { Component, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OtcService } from '../../../../../../services/otc.service';
import { UtilService } from '../../../../../../services/util.service';
import { StorageService } from '../../../../../../services/storage.service';

@Component({
  selector: 'admin-otc-listing-orders-modal',
  templateUrl: './otc-listing-orders.component.html',
  styleUrls: ['./otc-listing-orders.component.css']
})
export class OtcListingOrdersModal {
  @Input() listing: any;
  token = '';

  @ViewChild('otcListingOrdersModal', { static: true }) public otcListingOrdersModal: ModalDirective = {} as ModalDirective;
  // @Output() confirmedGas = new EventEmitter<number>();

  /*
  depositAmountForm = this.fb.group({
      depositAmount: ['']
  });     
  */
  buyOrderStatuses = ['Waiting for pay', 'Paid already', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  buyOrderButtonStatuses = ['Confirm pay', 'Confirm receipt'];

  sellOrderStatuses = ['Waiting for collect', 'Waiting for confirm', 'Finished', 'Cancelled', 'Frozened', 'All orders'];
  sellOrderButtonStatuses = ['I have collected', 'Confirm receipt'];
  constructor(private storageService: StorageService, private _otcServ: OtcService, public utilServ: UtilService) {
    this.storageService.getToken().subscribe(
      (token: any) => {
        this.token = token;
      }
    );
  }

  getButtonText(buy: boolean, status: number) {
    buy = !buy;
    let text = '';
    if (buy && (status < this.buyOrderButtonStatuses.length)) {
      text = this.buyOrderButtonStatuses[status];
    } else
      if (!buy && (status < this.sellOrderButtonStatuses.length)) {
        text = this.sellOrderButtonStatuses[status];
      }
    return text;
  }

  changePaymentStatus(element: any, paymentStatus: string) {
    this._otcServ.changePaymentStatus(this.token, element._id, paymentStatus).subscribe(
      (res: any) => {
        if (res && res.ok) {
          element.paymentStatus = paymentStatus;
        }
      }
    );
  }

  getStatusText(buy: boolean, status: number) {
    buy = !buy;
    let text = '';
    if (buy) {
      text = this.buyOrderStatuses[status];
    } else {
      text = this.sellOrderStatuses[status];
    }
    return text;
  }

  onSubmit() {
    // const depositAmount = this.depositAmountForm.get('depositAmount').value;
    //const amount = Number(depositAmount);
    // this.confirmedGas.emit(amount);
    this.hide();
  }

  show(listing: any) {
    console.log('listing===', this.listing);
    this.listing = listing;
    this.otcListingOrdersModal.show();
  }

  hide() {
    this.otcListingOrdersModal.hide();
  }
}