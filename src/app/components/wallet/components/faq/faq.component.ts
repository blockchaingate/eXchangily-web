import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, MatExpansionModule, TranslateModule],
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
    constructor () {
    }
    
    ngOnInit() {
    }
}
