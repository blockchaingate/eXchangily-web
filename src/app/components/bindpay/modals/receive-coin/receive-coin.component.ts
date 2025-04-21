import { CommonModule } from '@angular/common';
import { Component, TemplateRef, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { QRCodeComponent } from 'angularx-qrcode';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'modal-receive-coin',
    standalone: true,
    imports: [CommonModule, MatIconModule, QRCodeComponent, TranslateModule],
    templateUrl: './receive-coin.component.html',
    styleUrls: ['./receive-coin.component.scss']
})
export class ReceiveCoinModal {
    modalRef: BsModalRef = {} as BsModalRef;
    @Input() address = '';
    exAddr = '';
    link = '';
    constructor(private modalService: BsModalService) {
    }

    openModal(template: TemplateRef<any>) {
        console.log('this.addresseeee=', this.address);
        this.exAddr = this.address;
        this.modalRef = this.modalService.show(template);
    }  

    copyAddress() {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.exAddr;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    
    dlDataUrlBin() {
        const y = document.getElementById('address_qr_code')?.getElementsByTagName('canvas')[0];
        //console.log('y.src=' + y.src);
        if(y) {
            var link = y.toDataURL("image/png");
            this.link = link;   
        }
     
    }
}
