import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'apply-for-merchant-modal',
    templateUrl: './apply-for-merchant.html',
    styleUrls: ['./apply-for-merchant.css']
})
export class ApplyForMerchantModal {
    applyForMerchantModalForm = this.fb.group({
        quantity: ['0'],
        amount: ['0'],
        method: ['alipay']
    });
    @ViewChild('applyForMerchantModal', { static: true }) public applyForMerchantModal: ModalDirective = {} as ModalDirective;
    methods: string[] = ['alipay', 'bank'];

    constructor(private fb: FormBuilder) { }

    show() {
        this.applyForMerchantModal.show();
    }

    hide() {
        this.applyForMerchantModal.hide();
    }

    onSubmit() {
    }
}
