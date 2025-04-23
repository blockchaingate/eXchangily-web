import { Component, ViewChild, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'verify-seed-phrase-modal',
    templateUrl: './verify-seed-phrase.modal.html',
    styleUrls: ['./verify-seed-phrase.modal.css']
})
export class VerifySeedPhraseModal  implements OnInit {
    @ViewChild('verifySeedPhraseModal', {static: true}) public verifySeedPhraseModal: ModalDirective;
    verifySeedPhraseForm: FormGroup;
    verifyResult: string;
    seedPhrase: string;
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
