import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
import { AddressKeyComponent } from '../components/address-key/address-key.component';
@Component({
    selector: 'backup-private-key-modal',
    templateUrl: './backup-private-key.modal.html',
    styleUrls: ['./backup-private-key.modal.css']
})
export class BackupPrivateKeyModal {
    seed: Buffer;
    wallet: Wallet;
    currentCoin: MyCoin;
    mycoins: any;
    fabAddress = 'unknown';

    @ViewChild('backupPrivateKeyModal', {static: true}) public backupPrivateKeyModal: ModalDirective;

    // @ViewChild(AddressKeyComponent, {static: true}) addressKey: AddressKeyComponent;
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
        this.currentCoin = this.mycoins[index];
        // this.addressKey.showPage();
        console.log('this.currentCoin=', this.currentCoin);
    }

    show(seed: Buffer, wallet: Wallet) {
        this.seed = seed;
        this.wallet = wallet;
        this.mycoins = this.wallet.mycoins.filter((coin) => (coin.tokenType !== 'FAB') && (coin.tokenType !== 'ETH'));
        if (this.wallet.excoin && this.wallet.excoin.receiveAdds.length > 0) {
            this.fabAddress = this.wallet.excoin.receiveAdds[0].address;
        }
        // console.log('this.wallet:', this.wallet);
        this.currentCoin = this.mycoins[0];
        // console.log('currentCoin:', this.currentCoin);
        this.backupPrivateKeyModal.show();
    }

    hide() {
        this.backupPrivateKeyModal.hide();
    }
}
