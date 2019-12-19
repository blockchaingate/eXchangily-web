import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
@Component({
    selector: 'backup-private-key-modal',
    templateUrl: './backup-private-key.modal.html',
    styleUrls: ['./backup-private-key.modal.css']
})
export class BackupPrivateKeyModal {
    seed: Buffer;
    wallet: Wallet;
    currentCoin: MyCoin;

    @ViewChild('backupPrivateKeyModal', {static: true}) public backupPrivateKeyModal: ModalDirective;
    @Output() confirmedBackupPrivateKey = new EventEmitter<string>();

    backupPrivateKeyForm = this.fb.group({
    });    

    constructor(private fb: FormBuilder) {

    }

    onSubmit() {
        console.log('onSubmit at BackupPrivateKeyModal');
        this.confirmedBackupPrivateKey.emit('exportAll');
        this.hide();
    }
    onChange(index: number) {
        this.currentCoin = this.wallet.mycoins[index];
        
        //console.log(selectedValue);
    }  
    show(seed: Buffer, wallet: Wallet) {
        this.seed = seed;
        this.wallet = wallet;
        // console.log('this.wallet:', this.wallet);
        this.currentCoin = this.wallet.mycoins[0];
        // console.log('currentCoin:', this.currentCoin);
        this.backupPrivateKeyModal.show();
    }
    hide() {
        this.backupPrivateKeyModal.hide();
    }
}
