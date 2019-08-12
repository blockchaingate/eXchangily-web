import { Component, TemplateRef, Input} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import { MyCoin} from '../../../../models/mycoin';
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
    constructor(private modalService: BsModalService) {

    }
    openModal(template: TemplateRef<any>) {
        if (this.wallet) {
            this.currentAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        }        
        console.log('open heere');
        this.modalRef = this.modalService.show(template);
    }  

    onChange(index: number) {
        console.log(index);
        this.currentAddress = this.wallet.mycoins[index].receiveAdds[0].address;
        //console.log(selectedValue);
    }           
}
