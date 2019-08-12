import { Component, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'modal-transaction-history',
    templateUrl: './transaction-history.modal.html',
    styleUrls: ['./transaction-history.modal.css']
})
export class TransactionHistoryModal {
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) {
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
      }     
}
