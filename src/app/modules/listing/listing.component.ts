import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  lang = 'en';
  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(
      (langObj: any) => {
        this.lang = langObj.lang;
      }
    );
  }

}
