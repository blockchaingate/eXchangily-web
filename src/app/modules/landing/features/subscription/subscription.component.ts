import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
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
    invalidEmail = false;
    success = false;

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
        this.invalidEmail = true;
        return;
      }

      this.invalidEmail = false;

      this.subscribServ.create(this.email, this.name).subscribe(
            (res: any) => {
                if (res) {
                    this.success = true;
                }          
            }
      );
  }
}
