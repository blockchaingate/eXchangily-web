import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MnemeditComponent } from '../mnemonic/mnemedit.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-confirm-mnemonics',
    standalone: true,
    imports: [CommonModule, MnemeditComponent, TranslateModule],
    templateUrl: './confirmmnem.component.html',
    styleUrls: ['./createwallet.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmMnemonicsComponent {
    constructor() {
    }
}
