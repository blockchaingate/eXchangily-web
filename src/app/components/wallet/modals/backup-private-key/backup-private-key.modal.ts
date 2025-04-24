import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Wallet } from '../../../../models/wallet';
import { MyCoin } from '../../../../models/mycoin';
import { AddressKeyComponent } from '../components/address-key/address-key.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'backup-private-key-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, AddressKeyComponent, ReactiveFormsModule, TranslateModule],
    templateUrl: './backup-private-key.modal.html',
    styleUrls: ['./backup-private-key.modal.css']
})
export class BackupPrivateKeyModal {
    seed: Buffer = Buffer.from('');
    wallet: Wallet = {} as Wallet;
    currentCoin: MyCoin = {} as MyCoin;
    mycoins: any;
    fabAddress = 'unknown';

    @ViewChild('backupPrivateKeyModal', { static: true }) public backupPrivateKeyModal: ModalDirective = {} as ModalDirective;

    // @ViewChild(AddressKeyComponent, {static: true}) addressKey: AddressKeyComponent;
    @Output() confirmedBackupPrivateKey = new EventEmitter<string>();

    backupPrivateKeyForm: FormGroup = {} as FormGroup;

    constructor(private fb: FormBuilder) {
        this.backupPrivateKeyForm = this.fb.group({
        });
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

    onChangeEvent(event: any) {
        const index = Number((event.target as HTMLInputElement).value);
        this.onChange(index);
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
