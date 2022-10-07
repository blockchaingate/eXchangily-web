import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
//import { Subscription } from 'rxjs';
import { SubscriptionService } from '../../../../services/subscription.service';

const whitepaperPath = './assets/pdfs/wp';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
    name = '';
    email = '';
    success = false;
    errMsg = '';

    constructor(private _translate: TranslateService, private subscribServ: SubscriptionService) { }

    onNameKey(name: string) {
        this.name = name;
    }

    onEmailKey(email: string) {
        this.email = email;
    }

    onSubmit() {
        const validEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email));
        if (!validEmail) {
            this.errMsg = 'Invalid email';
            return;
        }

        this.errMsg = '';

        this.subscribServ.create(this.email, this.name).then(
            (res: any) => {
                    this.success = true;
                    this.name = '';
                    this.email = '';
            },
            (err: any) => {
                this.errMsg = err.message;
            }
        );
    }
}
