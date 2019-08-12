import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-advblock',
    templateUrl: './advblock.component.html',
    styleUrls: ['./advblock.component.css']
})
export class AdvblockComponent {
    @Input() title: string;
    @Input() desc: string;
    @Input() bgimgurl: string;
    @Input() linkurl: string;

    constructor(private _router: Router) {}

    showDetail() {
        this._router.navigate([this.linkurl]);
    }
}
