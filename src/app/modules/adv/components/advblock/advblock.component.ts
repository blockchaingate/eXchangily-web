import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-advblock',
    templateUrl: './advblock.component.html',
    styleUrls: ['./advblock.component.scss']
})
export class AdvblockComponent {
    @Input() bNum = '';
    @Input() title = '';
    @Input() desc1 = '';
    @Input() desc2 = '';
    @Input() desc3 = '';
    @Input() desc4 = '';
    @Input() bgimgurl = '';
    @Input() linkurl = '';
    
    constructor(private _router: Router) {}

}
