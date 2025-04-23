import { Component, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
import { UtilService } from '../../../../services/util.service';
import bchaddr from 'bchaddrjs';

@Component({
    selector: 'modal-receive-coin',
    templateUrl: './receive-coin.modal.html',
    styleUrls: ['./receive-coin.modal.css']
})
export class ReceiveCoinModal {
    modalRef: BsModalRef;
    @Input() wallet: Wallet;
    currentAddress: string;
    currentCoin: MyCoin;
    link: string;
    constructor(private modalService: BsModalService, private utilServ: UtilService) {

    }
    openModal(template: TemplateRef<any>) {
        if (this.wallet) {
            this.currentAddress = this.wallet.mycoins[1].receiveAdds[0].address;
        }
        console.log('open heere');
        this.modalRef = this.modalService.show(template);
    }

    copyAddress() {
        this.utilServ.copy(this.currentAddress);
    }

    onChange(event: any) {
        const index = (event.target as HTMLInputElement).value;
        /*
        if (this.wallet.mycoins[index].tokenType === 'FAB') {
            this.currentAddress = this.wallet.mycoins[1].receiveAdds[0].address;
        } else {
            this.currentAddress = this.wallet.mycoins[index].receiveAdds[0].address;
        }
        */
       this.currentAddress = this.wallet.mycoins[index].receiveAdds[0].address;
        // console.log(selectedValue);
    }

    changeToLegacyAddress() {
        this.currentAddress = bchaddr.toLegacyAddress(this.currentAddress);
    }

    dlDataUrlBin() {
        const obj = document.getElementById('address_qr_code');
        if( obj && obj.getElementsByTagName('canvas')) {
            const y = obj.getElementsByTagName('canvas')[0];
            // console.log('y.src=' + y.src);
            if (y) {
                const link = y.toDataURL('image/png');
                this.link = link;
            }
        }


    }
}
