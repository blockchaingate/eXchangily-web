import { Component, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'show-seed-phrase-modal',
    standalone: true,
    imports: [CommonModule, ModalDirective, TranslateModule],
    templateUrl: './show-seed-phrase.modal.html',
    styleUrls: ['./show-seed-phrase.modal.css']
})
export class ShowSeedPhraseModal {
    @ViewChild('showSeedPhraseModal', { static: true }) public showSeedPhraseModal: ModalDirective = {} as ModalDirective;
    seedPhrase = '';

    constructor() { }

    show(seedPhrase: string) {
        this.seedPhrase = seedPhrase;
        this.showSeedPhraseModal.show();
    }

    hide() {
        this.showSeedPhraseModal.hide();
    }
}
