import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [TranslateModule],
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
    constructor(private router: Router) {
    }

    routeTo(url: string) {
        this.router.navigateByUrl(url);
    }
}
