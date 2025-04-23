import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-advblock',
    templateUrl: './advblock.component.html',
    styleUrls: ['./advblock.component.scss']
})
export class AdvblockComponent {
    
    @Input() bNum: string;
    @Input() title: string;
    @Input() desc1: string;
    @Input() desc2: string;
    @Input() desc3: string;
    @Input() desc4: string;
    @Input() bgimgurl: string;
    @Input() linkurl: string;
    
    

    constructor(private _router: Router) {}

}
