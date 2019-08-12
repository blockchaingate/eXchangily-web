import { Component, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'modal-add-assets',
    templateUrl: './add-assets.modal.html',
    styleUrls: ['./add-assets.modal.css']
})
export class AddAssetsModal {
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) {
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
      }     
}
