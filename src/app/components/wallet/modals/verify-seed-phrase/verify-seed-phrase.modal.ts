import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'verify-seed-phrase-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, ReactiveFormsModule, TranslateModule],
    templateUrl: './verify-seed-phrase.modal.html',
    styleUrls: ['./verify-seed-phrase.modal.css']
})
export class VerifySeedPhraseModal implements OnInit {
    @ViewChild('verifySeedPhraseModal', { static: true }) public verifySeedPhraseModal: ModalDirective = {} as ModalDirective;
    verifySeedPhraseForm: FormGroup = {} as FormGroup;
    verifyResult = '';
    seedPhrase = '';

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.verifyResult = '';
        this.verifySeedPhraseForm = this.fb.group({
            seedphrase: [null, [Validators.required]]
        });
    }

    onSubmit() {
        const mnemonic = this.verifySeedPhraseForm.value.seedphrase;
        if (mnemonic === this.seedPhrase) {
            this.verifyResult = 'Great, you have the correct seed phrase for the wallet.';
        } else {
            this.verifyResult = 'The seed phrase is not for the wallet.';
        }
    }

    show(seedPhrase: string) {
        this.seedPhrase = seedPhrase;
        this.verifySeedPhraseModal.show();
    }

    hide() {
        this.verifySeedPhraseModal.hide();
    }
}
