import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-manual',
    standalone: true,
    imports: [CommonModule, MatCardModule, TranslateModule],
    templateUrl: './manual.component.html',
    styleUrls: ['./manual.component.scss']
})
export class ManualComponent {
}
