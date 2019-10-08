import { Component, TemplateRef, Input} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import { MyCoin} from '../../../../models/mycoin';
import { UtilService } from '../../../../services/util.service';
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
            this.currentAddress = this.wallet.mycoins[0].receiveAdds[0].address;
        }        
        console.log('open heere');
        this.modalRef = this.modalService.show(template);
    }  

    copyAddress() {
        this.utilServ.copy(this.currentAddress);
    }

    onChange(index: number) {
        console.log(index);
        this.currentAddress = this.wallet.mycoins[index].receiveAdds[0].address;
        //console.log(selectedValue);
    }    
    
    dlDataUrlBin() {
        const y = document.getElementById('address_qr_code').getElementsByTagName('img')[0];
        console.log('y.src=' + y.src);
        this.link = y.src;        
    }
}
