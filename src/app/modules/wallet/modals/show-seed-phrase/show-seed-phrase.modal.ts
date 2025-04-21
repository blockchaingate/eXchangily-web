import { Component, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'show-seed-phrase-modal',
    templateUrl: './show-seed-phrase.modal.html',
    styleUrls: ['./show-seed-phrase.modal.css']
})
export class ShowSeedPhraseModal {
    @ViewChild('showSeedPhraseModal', { static: true }) public showSeedPhraseModal: ModalDirective = {} as ModalDirective;

    seedPhrase = '';

    constructor() {
    }

    show(seedPhrase: string) {
        this.seedPhrase = seedPhrase;
        this.showSeedPhraseModal.show();
    }

    hide() {
        this.showSeedPhraseModal.hide();
    }
}
