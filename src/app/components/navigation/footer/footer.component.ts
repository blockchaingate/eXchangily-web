import { Component, OnInit } from '@angular/core';
import { Icons } from '../../../../environments/icons';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year: number;
  lang = 'en';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer    
  ) { }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
    this.lang = window.localStorage.getItem('Lan').toLowerCase();

    const icons = Icons;
    for(let i=0; i<icons.length; i++) {
      const icon = icons[i];
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/" + icon + ".svg")
      );        
    }     
  }

}
